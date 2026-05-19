<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $notifications = Notification::query()
            ->where('user_id', $userId)
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json(['data' => $notifications]);
    }

    public function markAsRead(Request $request, int $id)
    {
        $userId = $request->user()->id;

        $notification = Notification::query()
            ->where('user_id', $userId)
            ->findOrFail($id);

        $notification->read = true;
        $notification->save();

        return response()->json(['data' => $notification]);
    }

    public function markAllAsRead(Request $request)
    {
        $userId = $request->user()->id;

        Notification::query()
            ->where('user_id', $userId)
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}

