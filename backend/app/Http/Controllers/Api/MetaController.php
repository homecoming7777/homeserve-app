<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\Category;

class MetaController extends Controller
{
    public function categories()
    {
        return response()->json([
            'data' => Category::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function areas()
    {
        return response()->json([
            'data' => Area::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }
}

