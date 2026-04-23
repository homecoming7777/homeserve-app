<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::query();

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->integer('client_id'));
        }

        if ($request->filled('provider_id')) {
            $query->where('provider_id', $request->integer('provider_id'));
        }

        return response()->json($query->latest()->get());
    }

    public function show(string $id)
    {
        return response()->json(Booking::findOrFail($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id' => ['required', 'integer', 'exists:users,id'],
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'provider_id' => ['required', 'integer', 'exists:users,id'],
            'booking_date' => ['required', 'date'],
            'address' => ['required', 'string', 'max:255'],
        ]);

        $booking = Booking::create([
            ...$data,
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);

        return response()->json($booking, 201);
    }

    public function updateStatus(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);
        $data = $request->validate([
            'status' => ['required', 'in:pending,accepted,rejected,in_progress,completed'],
        ]);

        $booking->status = $data['status'];
        if ($data['status'] === 'completed') {
            $booking->completed_at = now();
        }
        $booking->save();

        return response()->json($booking);
    }

    public function updatePayment(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update($request->validate([
            'payment_method' => ['nullable', 'in:cash,wallet,card'],
            'payment_status' => ['nullable', 'in:pending,paid'],
            'payment_id' => ['nullable', 'string', 'max:255'],
            'paid_at' => ['nullable', 'date'],
        ]));

        return response()->json($booking->fresh());
    }
}
