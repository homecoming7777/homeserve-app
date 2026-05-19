<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AppAssistantService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AssistantController extends Controller
{
    public function chat(Request $request, AppAssistantService $assistant)
    {
        $data = $request->validate([
            'history' => ['required', 'array', 'min:1', 'max:20'],
            'history.*.role' => ['required', Rule::in(['user', 'assistant'])],
            'history.*.content' => ['required', 'string', 'max:2000'],
            'route' => ['nullable', 'string', 'max:120'],
        ]);

        $history = collect($data['history'])
            ->map(fn (array $m) => [
                'role' => $m['role'] === 'assistant' ? 'assistant' : 'user',
                'content' => trim($m['content']),
            ])
            ->filter(fn (array $m) => $m['content'] !== '')
            ->values()
            ->all();

        $plan = $assistant->plan($request->user(), $history, $data['route'] ?? '/');

        return response()->json([
            'data' => [
                'reply' => $plan['reply'],
                'actions' => $plan['actions'] ?? [],
            ],
        ]);
    }

    public function guestChat(Request $request, AppAssistantService $assistant)
    {
        $data = $request->validate([
            'history' => ['required', 'array', 'min:1', 'max:20'],
            'history.*.role' => ['required', Rule::in(['user', 'assistant'])],
            'history.*.content' => ['required', 'string', 'max:2000'],
            'route' => ['nullable', 'string', 'max:120'],
        ]);

        $history = collect($data['history'])
            ->map(fn (array $m) => [
                'role' => $m['role'] === 'assistant' ? 'assistant' : 'user',
                'content' => trim($m['content']),
            ])
            ->filter(fn (array $m) => $m['content'] !== '')
            ->values()
            ->all();

        $plan = $assistant->plan(null, $history, $data['route'] ?? '/');

        return response()->json([
            'data' => [
                'reply' => $plan['reply'],
                'actions' => $plan['actions'] ?? [],
            ],
        ]);
    }
}

