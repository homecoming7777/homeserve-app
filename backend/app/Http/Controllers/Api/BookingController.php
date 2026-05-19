<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Services\NotificationService;
use App\Services\PaymentService;
use App\Services\ProviderRankingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class BookingController extends Controller
{
    public function store(Request $request, PaymentService $payments, NotificationService $notifications)
    {
        $data = $request->validate([
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'booking_date' => ['required', 'date'],
            'address' => ['required', 'string', 'max:255'],
            'payment_method' => ['required', Rule::in(['cash', 'card', 'wallet'])],
        ]);

        $client = $request->user();
        $service = Service::query()->with(['provider:id', 'availabilityRules'])->findOrFail($data['service_id']);
        $bookingDate = Carbon::parse($data['booking_date'])->seconds(0);

        if (! $service->is_available) {
            return response()->json(['message' => 'Service is not available.'], 422);
        }
        if (! $this->isSlotAvailable($service, $bookingDate)) {
            return response()->json(['message' => 'Selected time slot is not available.'], 422);
        }

        try {
            $booking = DB::transaction(function () use ($data, $client, $service, $payments, $notifications, $bookingDate) {
                $booking = Booking::query()->create([
                    'client_id' => $client->id,
                    'service_id' => $service->id,
                    'booking_date' => $bookingDate->format('Y-m-d H:i:s'),
                    'address' => $data['address'],
                    'status' => 'pending',
                    'payment_method' => $data['payment_method'],
                    'payment_status' => 'pending',
                    'payment_id' => null,
                    'paid_at' => null,
                ]);

                // Payment initialization (payment completes on client approval)
                $payments->applyPaymentForNewBooking($booking, $client, $service);
                $booking->save();

                // Notifications
                $notifications->create(
                    $service->provider_id,
                    'New booking',
                    "You received a new booking request for: {$service->title}.",
                );

                return $booking;
            });
        } catch (\RuntimeException $e) {
            if ($e->getMessage() === 'Insufficient wallet balance.') {
                return response()->json(['message' => 'Insufficient wallet balance.'], 422);
            }
            throw $e;
        }

        return response()->json([
            'data' => $booking->load(['service:id,title,price,provider_id', 'service.provider:id,name,phone']),
        ], 201);
    }

    public function myBookings(Request $request)
    {
        $clientId = $request->user()->id;

        $bookings = Booking::query()
            ->with(['service:id,title,price,provider_id', 'service.provider:id,name,phone'])
            ->where('client_id', $clientId)
            ->orderByDesc('id')
            ->paginate(12);

        return response()->json(['data' => $bookings]);
    }

    public function providerBookings(Request $request)
    {
        $providerId = $request->user()->id;

        $bookings = Booking::query()
            ->with([
                'client:id,name,phone,address',
                'service:id,title,price,provider_id',
            ])
            ->whereHas('service', fn ($q) => $q->where('provider_id', $providerId))
            ->orderByDesc('id')
            ->paginate(12);

        return response()->json(['data' => $bookings]);
    }

    public function updateStatus(Request $request, int $id, NotificationService $notifications)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['accepted', 'rejected'])],
        ]);

        $providerId = $request->user()->id;

        $booking = Booking::query()
            ->with(['service:id,title,provider_id', 'client:id'])
            ->whereHas('service', fn ($q) => $q->where('provider_id', $providerId))
            ->findOrFail($id);

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Only pending bookings can be updated.'], 422);
        }

        $booking->status = $data['status'];
        $booking->save();

        $notifications->create(
            $booking->client_id,
            'Booking update',
            "Your booking #{$booking->id} was {$booking->status}.",
        );

        return response()->json(['data' => $booking]);
    }

    // Provider confirms service completed
    public function providerMarkCompleted(Request $request, int $id, NotificationService $notifications)
    {
        $providerId = $request->user()->id;

        $booking = Booking::query()
            ->with(['service:id,title,provider_id', 'client:id'])
            ->whereHas('service', fn ($q) => $q->where('provider_id', $providerId))
            ->findOrFail($id);

        if ($booking->status !== 'accepted') {
            return response()->json(['message' => 'Only accepted bookings can be completed.'], 422);
        }

        if ($booking->provider_completed_at) {
            return response()->json(['message' => 'Already marked completed by provider.'], 422);
        }

        $booking->provider_completed_at = now();
        $booking->save();

        $notifications->create(
            $booking->client_id,
            'Service completed',
            "Provider marked booking #{$booking->id} as completed. Please approve to finalize payment.",
        );

        return response()->json(['data' => $booking]);
    }

    // Client approves completion -> payment completes (and optionally review is added via separate endpoint)
    public function clientApproveCompleted(
        Request $request,
        int $id,
        PaymentService $payments,
        NotificationService $notifications,
        ProviderRankingService $ranking
    )
    {
        $client = $request->user();

        $booking = Booking::query()
            ->with(['service:id,title,price,provider_id', 'service.provider:id'])
            ->where('client_id', $client->id)
            ->findOrFail($id);

        if ($booking->status !== 'accepted') {
            return response()->json(['message' => 'Only accepted bookings can be approved.'], 422);
        }
        if (! $booking->provider_completed_at) {
            return response()->json(['message' => 'Provider has not marked this booking as completed yet.'], 422);
        }
        if ($booking->client_approved_at) {
            return response()->json(['message' => 'Already approved.'], 422);
        }

        try {
            DB::transaction(function () use ($booking, $client, $payments, $notifications) {
                $service = $booking->service;
                $payments->completePaymentOnClientApproval($booking, $client, $service);
                $booking->client_approved_at = now();
                $booking->save();

                $notifications->create(
                    $client->id,
                    'Payment success',
                    "Payment completed for booking #{$booking->id}.",
                );

                $notifications->create(
                    $service->provider_id,
                    'Payment success',
                    "Payment completed for booking #{$booking->id}.",
                );
            });
        } catch (\RuntimeException $e) {
            if ($e->getMessage() === 'Insufficient wallet balance.') {
                return response()->json(['message' => 'Insufficient wallet balance.'], 422);
            }
            throw $e;
        }

        $provider = $booking->service->provider()->first();
        if ($provider) {
            $ranking->recalculate($provider);
        }

        return response()->json(['data' => $booking->fresh()->load(['service:id,title,price,provider_id'])]);
    }

    public function clientAnalytics(Request $request)
    {
        $clientId = $request->user()->id;

        $total = Booking::query()->where('client_id', $clientId)->count();
        $pending = Booking::query()->where('client_id', $clientId)->where('status', 'pending')->count();
        $accepted = Booking::query()->where('client_id', $clientId)->where('status', 'accepted')->count();
        $rejected = Booking::query()->where('client_id', $clientId)->where('status', 'rejected')->count();

        return response()->json([
            'data' => [
                'total_bookings' => $total,
                'pending' => $pending,
                'accepted' => $accepted,
                'rejected' => $rejected,
            ],
        ]);
    }

    public function providerAnalytics(Request $request)
    {
        $providerId = $request->user()->id;

        $totalServices = Service::query()->where('provider_id', $providerId)->count();

        $bookingsQuery = Booking::query()->whereHas('service', fn ($q) => $q->where('provider_id', $providerId));

        $totalBookings = (clone $bookingsQuery)->count();
        $pending = (clone $bookingsQuery)->where('status', 'pending')->count();
        $accepted = (clone $bookingsQuery)->where('status', 'accepted')->count();

        $earnings = (clone $bookingsQuery)
            ->where('status', 'accepted')
            ->where('payment_status', 'paid')
            ->whereNotNull('client_approved_at')
            ->join('services', 'bookings.service_id', '=', 'services.id')
            ->sum('services.price');

        // Generate monthly revenue for the last 6 months
        $monthlyRevenue = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $monthEarnings = (clone $bookingsQuery)
                ->where('bookings.status', 'accepted')
                ->where('bookings.payment_status', 'paid')
                ->whereNotNull('bookings.client_approved_at')
                ->whereBetween('bookings.client_approved_at', [$monthStart, $monthEnd])
                ->join('services as s2', 'bookings.service_id', '=', 's2.id')
                ->sum('s2.price');

            $monthlyRevenue->push([
                'name' => $month->format('M'),
                'revenue' => (float) $monthEarnings,
            ]);
        }

        $rankingSummary = app(\App\Services\ProviderRankingService::class)->getSummary($request->user());

        return response()->json([
            'data' => [
                'total_services' => $totalServices,
                'total_bookings' => $totalBookings,
                'pending_requests' => $pending,
                'accepted_jobs' => $accepted,
                'total_earnings' => (string) $earnings,
                'monthly_revenue' => $monthlyRevenue,
                'ranking_summary' => $rankingSummary,
            ],
        ]);
    }

    private function isSlotAvailable(Service $service, Carbon $bookingDate): bool
    {
        $dayRules = $service->availabilityRules->where('day_of_week', $bookingDate->dayOfWeek);
        if ($dayRules->isEmpty()) {
            return false;
        }

        $slotStart = $bookingDate->format('H:i:s');
        $slotEnd = $bookingDate->copy()->addMinutes($service->slot_duration_minutes)->format('H:i:s');
        $inWindow = $dayRules->contains(fn ($rule) => $rule->start_time <= $slotStart && $rule->end_time >= $slotEnd);
        if (! $inWindow) {
            return false;
        }

        return ! Booking::query()
            ->where('service_id', $service->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->where('booking_date', $bookingDate->format('Y-m-d H:i:s'))
            ->exists();
    }
}

