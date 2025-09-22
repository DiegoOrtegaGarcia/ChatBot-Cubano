<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\IAController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::post("/roselia",[IAController::class , "processMessage"]);
