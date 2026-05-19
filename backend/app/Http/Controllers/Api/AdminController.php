<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'data' => [
                'users' => User::query()->count(),
                'clients' => User::query()->where('role', 'client')->count(),
                'providers' => User::query()->where('role', 'provider')->count(),
                'services' => Service::query()->count(),
                'bookings' => Booking::query()->count(),
                'reviews' => Review::query()->count(),
            ],
        ]);
    }

    public function users()
    {
        return response()->json([
            'data' => User::query()
                ->select('id', 'name', 'email', 'role', 'phone', 'provider_points', 'provider_rank', 'is_active')
                ->orderByDesc('id')
                ->limit(100)
                ->get(),
        ]);
    }

    public function services()
    {
        return response()->json([
            'data' => Service::query()
                ->with(['provider:id,name,email', 'category:id,name', 'area:id,name'])
                ->orderByDesc('id')
                ->limit(100)
                ->get(),
        ]);
    }

    public function bookings()
    {
        return response()->json([
            'data' => Booking::query()
                ->with(['client:id,name,email', 'service:id,title,provider_id', 'service.provider:id,name,email'])
                ->orderByDesc('id')
                ->limit(100)
                ->get(),
        ]);
    }

    public function reviews()
    {
        return response()->json([
            'data' => Review::query()
                ->with(['client:id,name,email', 'provider:id,name,email', 'service:id,title'])
                ->orderByDesc('id')
                ->limit(100)
                ->get(),
        ]);
    }

    public function updateUserRole(Request $request, int $id)
    {
        $data = $request->validate([
            'role' => ['required', Rule::in(['client', 'provider', 'admin'])],
        ]);

        $user = User::query()->findOrFail($id);
        $user->role = $data['role'];
        $user->save();

        return response()->json(['data' => $user]);
    }

    public function setUserActive(Request $request, int $id)
    {
        $data = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $user = User::query()->findOrFail($id);
        $user->is_active = $data['is_active'];
        $user->save();

        return response()->json(['data' => $user]);
    }

    public function deleteReview(int $id)
    {
        $review = Review::query()->findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Review deleted.']);
    }

    public function toggleServiceAvailability(Request $request, int $id)
    {
        $data = $request->validate(['is_available' => ['required', 'boolean']]);

        $service = Service::query()->findOrFail($id);
        $service->is_available = $data['is_available'];
        $service->save();

        return response()->json(['data' => $service]);
    }
}

