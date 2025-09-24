<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimitChat
{
    public function handle(Request $request, Closure $next, $maxAttempts = 10, $decayMinutes = 1): Response
    {
        $key = 'chat-message:' . ($request->user()?->id ?: $request->ip());

        $executed = RateLimiter::attempt(
            $key,
            $maxAttempts,
            function() {},
            $decayMinutes * 60
        );

        if (!$executed) {
            return response()->json([
                'success' => false,
                'error' => "Demasiadas solicitudes. Intenta nuevamente en {$decayMinutes} minuto(s)."
            ], 429);
        }

        return $next($request);
    }
}
