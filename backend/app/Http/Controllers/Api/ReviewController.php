<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use App\Services\NotificationService;
use App\Services\ProviderRankingService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    public function store(Request $request, int $bookingId, NotificationService $notifications, ProviderRankingService $ranking)
    {
        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'description' => ['nullable', 'string'],
        ]);

        $client = $request->user();

        $booking = Booking::query()
            ->with(['service:id,provider_id,title', 'review:id,booking_id'])
            ->where('client_id', $client->id)
            ->findOrFail($bookingId);

        if ($booking->status !== 'accepted' || ! $booking->client_approved_at) {
            return response()->json(['message' => 'You can only review after approving completion.'], 422);
        }

        if ($booking->review) {
            return response()->json(['message' => 'Review already exists for this booking.'], 422);
        }

        $review = Review::query()->create([
            'booking_id' => $booking->id,
            'client_id' => $client->id,
            'provider_id' => $booking->service->provider_id,
            'service_id' => $booking->service_id,
            'rating' => $data['rating'],
            'description' => $data['description'] ?? null,
        ]);

        $notifications->create(
            $booking->service->provider_id,
            'New review',
            "You received a {$review->rating}-star review for booking #{$booking->id}.",
        );
        $ranking->recalculate($booking->service->provider()->firstOrFail());

        return response()->json(['data' => $review], 201);
    }

    public function forService(int $serviceId)
    {
        $reviews = Review::query()
            ->with(['client:id,name'])
            ->where('service_id', $serviceId)
            ->orderByDesc('id')
            ->paginate(10);

        return response()->json(['data' => $reviews]);
    }
}

