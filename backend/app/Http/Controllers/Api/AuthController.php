<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ProviderRankingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['client', 'provider'])],
            'phone' => ['required', 'string', 'regex:/^(\+212|0)([ -]?)[5-7]\d{8}$/'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'phone' => $data['phone'],
            'address' => $data['address'] ?? null,
            'wallet_balance' => 0,
            'provider_points' => 0,
            'provider_rank' => 'Newcomer',
            'is_active' => true,
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => $this->serializeUser($user),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        /** @var User|null $user */
        $user = User::query()->where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 422);
        }
        if (! $user->is_active) {
            return response()->json(['message' => 'Account is deactivated. Please contact admin.'], 403);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => $this->serializeUser($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->user()?->currentAccessToken();
        if ($token) {
            $token->delete();
        }

        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request, ProviderRankingService $ranking)
    {
        /** @var User $user */
        $user = $request->user();
        $user->refresh();

        return response()->json([
            'user' => $this->serializeUser($user, $ranking),
        ]);
    }

    public function updateProfile(Request $request, ProviderRankingService $ranking)
    {
        /** @var User $user */
        $user = $request->user();
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'regex:/^(\+212|0)([ -]?)[5-7]\d{8}$/'],
            'address' => ['nullable', 'string', 'max:255'],
            'avatar_url' => ['nullable', 'url', 'max:2048'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $user->fill($data);
        $user->save();

        return response()->json([
            'user' => $this->serializeUser($user->fresh(), $ranking),
        ]);
    }

    private function serializeUser(User $user, ?ProviderRankingService $ranking = null): array
    {
        $providerSummary = null;
        if ($user->role === 'provider') {
            $providerSummary = ($ranking ?? app(ProviderRankingService::class))->getSummary($user);
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'phone' => $user->phone,
            'address' => $user->address,
            'avatar_url' => $user->avatar_url,
            'bio' => $user->bio,
            'wallet_balance' => (string) $user->wallet_balance,
            'provider_points' => $user->provider_points,
            'provider_rank' => $user->provider_rank,
            'provider_summary' => $providerSummary,
            'is_active' => $user->is_active,
            'created_at' => optional($user->created_at)?->toISOString(),
        ];
    }
}

