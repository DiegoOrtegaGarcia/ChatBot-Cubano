<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ChatService;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\MessageRequest;

class IAController extends Controller
{
    public function __construct(private ChatService $chatService) {}

    public function processMessage(MessageRequest $request)
    {
        try {
            $response = $this->chatService->processMessage(
                $request->message,
                $request->conversation_history ?? []
            );

            return response()->json([
                'success' => true,
                'response' => $response,
            ]);

        } catch (\Exception $e) {
            Log::error('Chat error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Error procesando mensaje'
            ], 500);
        }
    }
}
