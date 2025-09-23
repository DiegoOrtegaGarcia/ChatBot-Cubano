<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class IAController extends Controller
{
    public function processMessage(Request $request)
    {
        $request->validate([
            "message" => "required|string",
            "conversation_history" => "sometimes|array",
        ]);

            $message = [
            [
                "role" => "system",
                "content" => "Eres Yasmani, un asistente virtual cubano útil y amable.

                **COMPORTAMIENTO:**
                - Responde siempre en español claro y conciso
                - Sé profesional pero cercano y acogedor
                - Si no sabes algo, dilo honestamente
                - Solo saluda en el primer mensaje de la conversación

                **LENGUAJE:**
                - Utiliza dialecto cubano auténtico pero evita: 'que bola', 'asere', 'consorte'
                - Puedes usar expresiones como: 'mi hermano', 'compañero', 'chico', 'mi socio'

                **FORMATO DE RESPUESTAS (CRÍTICO):**
                - Todas las respuestas deben ser HTML válido y seguro para React
                - NO uses: <div>, <script>, <style>, eventos JavaScript (onclick, etc.)
                - Para subtítulos usa: <h3 class='font-bold underline'>Título</h3>
                - Para listas: <ul class='list-disc ml-4'>, <ol class='list-decimal ml-4'>
                - Para ítems: <li class='mb-1'>elemento</li>
                - Para énfasis: <strong class='font-bold'>, <em class='italic'>
                - Separa párrafos con: <p class='mb-2'>texto</p>
                - Mantén el HTML minimalista y seguro

                **RESTRICCIONES TÉCNICAS:**
                - El HTML se renderiza con dangerouslySetInnerHTML en React
                - Evita caracteres que puedan romper el JSON: comillas sin escapar, etc.
                - Las respuestas deben ser autocontenidas en un solo bloque HTML

                **OBJETIVO:**
                Proporcionar respuestas bien estructuradas, visualmente atractivas y culturalmente apropiadas para Cuba."
            ]
        ];

        if (!empty($request->conversation_history)) {
            foreach ($request->conversation_history as $mesage) {
                if (isset($mesage['role']) && isset($mesage['content'])) {
                    $message[] = [
                        "role" => $mesage["role"],
                        "content" => $mesage["content"]
                    ];
                }
            }
        }

        $message[] = [
            "role" => "user",
            "content" => $request->message
        ];

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('API_IA_KEY'),
            'Content-Type' => 'application/json',
        ])->timeout(30)->post('https://openrouter.ai/api/v1/chat/completions', [
            'model' => 'x-ai/grok-4-fast:free',
            'messages' => $message,
            'max_tokens' => 2000,
            'temperature' => 0.8,
            'top_p' => 0.9,
            'stream' => false
        ]);

        if ($response->failed()) {
            $errorBody = $response->body();
            \Log::error('OpenRouter API Error: ' . $errorBody);
            throw new \Exception('Error en la API de OpenRouter: ' . $errorBody);
        }
        $data = $response->json();

        if (!isset($data['choices'][0]['message']['content'])) {
            throw new \Exception('Respuesta inválida de OpenRouter');
        }

        return response()->json([
            'success' => true,
            'response' => $data['choices'][0]['message']['content'],
            'usage' => $data['usage'] ?? null
        ]);
    }
}
