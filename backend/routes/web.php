<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app'     => 'SIMMAS API Backend',
        'status'  => 'online',
        'version' => '1.0.0'
    ]);
});
