<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TicketAttachmentController;
use App\Http\Controllers\TicketCommentController;
use App\Http\Controllers\TicketController;
use App\Models\Software;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'softwares' => Software::query()->active()->orderBy('name')->pluck('name'),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    // Requester-only area: administrators are redirected to their panel.
    Route::middleware('requester')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('tickets', [TicketController::class, 'index'])->name('tickets.index');
        Route::get('tickets/create', [TicketController::class, 'create'])->name('tickets.create');
        Route::post('tickets', [TicketController::class, 'store'])->name('tickets.store');
        Route::get('tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
        Route::post('tickets/{ticket}/comments', [TicketCommentController::class, 'store'])->name('tickets.comments.store');
    });

    Route::get('attachments/{attachment}', [TicketAttachmentController::class, 'show'])->name('attachments.show');
});

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
