<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query();

        if ($request->filled('provider_id')) {
            $query->where('provider_id', $request->string('provider_id'));
        }

        return response()->json($query->latest()->get());
    }

    public function show(string $id)
    {
        return response()->json(Service::findOrFail($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'provider_id' => ['required', 'integer', 'exists:users,id'],
            'category' => ['required', 'string', 'max:120'],
            'area' => ['required', 'string', 'max:120'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:1'],
            'is_available' => ['nullable', 'boolean'],
        ]);

        return response()->json(Service::create($data), 201);
    }

    public function update(Request $request, string $id)
    {
        $service = Service::findOrFail($id);
        $service->update($request->validate([
            'category' => ['sometimes', 'string', 'max:120'],
            'area' => ['sometimes', 'string', 'max:120'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'price' => ['sometimes', 'numeric', 'min:1'],
            'is_available' => ['sometimes', 'boolean'],
        ]));

        return response()->json($service->fresh());
    }

    public function destroy(string $id)
    {
        Service::findOrFail($id)->delete();

        return response()->noContent();
    }
}
