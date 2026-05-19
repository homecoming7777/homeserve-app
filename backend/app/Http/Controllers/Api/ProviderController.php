<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ProviderRankingService;

class ProviderController extends Controller
{
    public function top(ProviderRankingService $ranking)
    {
        $providers = User::query()
            ->where('role', 'provider')
            ->orderByDesc('provider_points')
            ->limit(12)
            ->get();

        $data = $providers->map(function (User $provider) use ($ranking) {
            $summary = $ranking->getSummary($provider);

            return [
                'id' => $provider->id,
                'name' => $provider->name,
                'phone' => $provider->phone,
                'address' => $provider->address,
                'provider_points' => $summary['provider_points'],
                'provider_rank' => $summary['provider_rank'],
                'avg_rating' => $summary['avg_rating'],
                'completed_jobs' => $summary['completed_jobs'],
                'total_reviews' => $summary['total_reviews'],
                'recommendation_score' => $summary['recommendation_score'],
            ];
        })->sortByDesc('recommendation_score')->values();

        return response()->json(['data' => $data]);
    }
}

