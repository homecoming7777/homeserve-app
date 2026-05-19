<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    // Client: list all (optionally filter)
    public function index(Request $request)
    {
        $validated = $request->validate([
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'available' => ['nullable', 'boolean'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'max_distance_km' => ['nullable', 'numeric', 'min:0.5', 'max:200'],
        ]);

        $query = Service::query()
            ->select('services.*')
            ->with(['provider:id,name,phone,address', 'category:id,name', 'area:id,name'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->orderByDesc('id');
        $user = $request->user();
        if ($user && $user->role === 'client') {
            $query->selectRaw(
                'exists(select 1 from service_favorites sf where sf.service_id = services.id and sf.client_id = ?) as is_favorite',
                [$user->id]
            );
        }

        if (! empty($validated['area_id'])) {
            $query->where('area_id', $validated['area_id']);
        }
        if (! empty($validated['category_id'])) {
            $query->where('category_id', $validated['category_id']);
        }
        if (array_key_exists('available', $validated)) {
            $query->where('is_available', (bool) $validated['available']);
        }

        if (array_key_exists('lat', $validated) && array_key_exists('lng', $validated) && $validated['lat'] !== null && $validated['lng'] !== null) {
            $lat = (float) $validated['lat'];
            $lng = (float) $validated['lng'];
            $maxDistance = (float) ($validated['max_distance_km'] ?? 25);

            $distanceSql = '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))';
            $query->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->selectRaw("{$distanceSql} as distance_km", [$lat, $lng, $lat])
                ->having('distance_km', '<=', $maxDistance)
                ->orderBy('distance_km');
        }

        return response()->json(['data' => $query->paginate(12)]);
    }

    public function show(int $id)
    {
        $service = Service::query()
            ->with(['provider:id,name,phone,address,wallet_balance,role', 'category:id,name', 'area:id,name', 'availabilityRules'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->findOrFail($id);
        $user = request()->user();
        if ($user && $user->role === 'client') {
            $service->setAttribute('is_favorite', DB::table('service_favorites')
                ->where('client_id', $user->id)
                ->where('service_id', $service->id)
                ->exists());
        }

        return response()->json(['data' => $service]);
    }

    public function byArea(int $id)
    {
        $services = Service::query()
            ->with(['provider:id,name,phone,address', 'category:id,name', 'area:id,name'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->where('area_id', $id)
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $services]);
    }

    // Provider: list only own
    public function providerIndex(Request $request)
    {
        $providerId = $request->user()->id;

        $services = Service::query()
            ->with(['category:id,name', 'area:id,name'])
            ->where('provider_id', $providerId)
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $services]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'area_id' => ['required', 'integer', 'exists:areas,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'price' => ['required', 'numeric', 'min:0'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'slot_duration_minutes' => ['required', 'integer', 'min:15', 'max:240'],
            'is_available' => ['required', 'boolean'],
            'availability_rules' => ['required', 'array', 'min:1'],
            'availability_rules.*.day_of_week' => ['required', 'integer', 'between:0,6'],
            'availability_rules.*.start_time' => ['required', 'date_format:H:i'],
            'availability_rules.*.end_time' => ['required', 'date_format:H:i'],
        ]);

        $service = DB::transaction(function () use ($request, $data) {
            $service = Service::query()->create([
                'provider_id' => $request->user()->id,
                'category_id' => $data['category_id'],
                'area_id' => $data['area_id'],
                'title' => $data['title'],
                'description' => $data['description'],
                'image_url' => $data['image_url'] ?? null,
                'price' => $data['price'],
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'slot_duration_minutes' => $data['slot_duration_minutes'],
                'is_available' => $data['is_available'],
            ]);
            $this->syncAvailabilityRules($service, $data['availability_rules']);

            return $service;
        });

        return response()->json(['data' => $service->load('availabilityRules')], 201);
    }

    public function update(Request $request, int $id)
    {
        $service = Service::query()->where('provider_id', $request->user()->id)->findOrFail($id);

        $data = $request->validate([
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'area_id' => ['sometimes', 'integer', 'exists:areas,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'slot_duration_minutes' => ['sometimes', 'integer', 'min:15', 'max:240'],
            'is_available' => ['sometimes', 'boolean'],
            'availability_rules' => ['sometimes', 'array', 'min:1'],
            'availability_rules.*.day_of_week' => ['required_with:availability_rules', 'integer', 'between:0,6'],
            'availability_rules.*.start_time' => ['required_with:availability_rules', 'date_format:H:i'],
            'availability_rules.*.end_time' => ['required_with:availability_rules', 'date_format:H:i'],
        ]);

        DB::transaction(function () use ($service, $data) {
            $service->fill(collect($data)->except('availability_rules')->toArray());
            $service->save();

            if (array_key_exists('availability_rules', $data)) {
                $this->syncAvailabilityRules($service, $data['availability_rules']);
            }
        });

        return response()->json(['data' => $service->fresh()->load('availabilityRules')]);
    }

    public function destroy(Request $request, int $id)
    {
        $service = Service::query()->where('provider_id', $request->user()->id)->findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    public function myFavorites(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $clientId = $user->id;
        $services = Service::query()
            ->with(['provider:id,name,phone,address', 'category:id,name', 'area:id,name'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->whereHas('favoritedBy', fn ($q) => $q->where('users.id', $clientId))
            ->orderByDesc('id')
            ->get()
            ->each(fn ($s) => $s->setAttribute('is_favorite', true));

        return response()->json(['data' => $services]);
    }

    public function toggleFavorite(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->role !== 'client') {
            return response()->json(['message' => 'Only clients can favorite services.'], 403);
        }

        $clientId = $user->id;
        Service::query()->findOrFail($id);
        $exists = DB::table('service_favorites')
            ->where('client_id', $clientId)
            ->where('service_id', $id)
            ->exists();
        if ($exists) {
            DB::table('service_favorites')
                ->where('client_id', $clientId)
                ->where('service_id', $id)
                ->delete();

            return response()->json(['data' => ['is_favorite' => false]]);
        }

        DB::table('service_favorites')->insert([
            'client_id' => $clientId,
            'service_id' => $id,
            'created_at' => now(),
        ]);

        return response()->json(['data' => ['is_favorite' => true]]);
    }

    public function availableSlots(Request $request, int $id)
    {
        $data = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
        ]);
        $service = Service::query()->with('availabilityRules')->findOrFail($id);
        $date = Carbon::createFromFormat('Y-m-d', $data['date']);
        $dayOfWeek = $date->dayOfWeek;
        $rules = $service->availabilityRules->where('day_of_week', $dayOfWeek);

        $slots = [];
        foreach ($rules as $rule) {
            $cursor = Carbon::createFromFormat('Y-m-d H:i', "{$data['date']} " . substr($rule->start_time, 0, 5));
            $end = Carbon::createFromFormat('Y-m-d H:i', "{$data['date']} " . substr($rule->end_time, 0, 5));

            while ($cursor->lt($end)) {
                $slotStart = $cursor->copy();
                $slotEnd = $slotStart->copy()->addMinutes($service->slot_duration_minutes);
                if ($slotEnd->gt($end)) {
                    break;
                }
                $isBooked = DB::table('bookings')
                    ->where('service_id', $service->id)
                    ->whereIn('status', ['pending', 'accepted'])
                    ->where('booking_date', $slotStart->format('Y-m-d H:i:s'))
                    ->exists();
                if (! $isBooked) {
                    $slots[] = $slotStart->format('Y-m-d H:i:s');
                }
                $cursor->addMinutes($service->slot_duration_minutes);
            }
        }

        return response()->json(['data' => $slots]);
    }

    private function syncAvailabilityRules(Service $service, array $rules): void
    {
        $normalizedRules = collect($rules)
            ->map(function (array $rule) {
                return [
                    'day_of_week' => $rule['day_of_week'],
                    'start_time' => $rule['start_time'] . ':00',
                    'end_time' => $rule['end_time'] . ':00',
                ];
            })
            ->filter(fn (array $rule) => $rule['start_time'] < $rule['end_time'])
            ->values()
            ->all();

        $service->availabilityRules()->delete();
        if (! empty($normalizedRules)) {
            $service->availabilityRules()->createMany($normalizedRules);
        }
    }
}
