<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatService
{
    private array $systemPrompt;
    private string $model;

    public function __construct()
    {
        $this->model = "x-ai/grok-4-fast:free";
        $this->systemPrompt = [
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
        ];
    }

    public function processMessage(string $userMessage, array $conversationHistory = []): string
    {
        $messages = $this->buildMessages($userMessage, $conversationHistory);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('API_IA_KEY'),
            'Content-Type' => 'application/json',
        ])->timeout(30)->post('https://openrouter.ai/api/v1/chat/completions', [
            'model' => $this->model,
            'messages' => $messages,
            'max_tokens' => 2000,
            'temperature' => 0.8,
            'top_p' => 0.9,
            'stream' => false
        ]);

        if ($response->failed()) {
            throw new \Exception('Error en la API: ' . $response->body());
        }

        return $this->extractResponse($response->json());
    }

    private function buildMessages(string $userMessage, array $conversationHistory): array
    {
        $messages = [$this->systemPrompt];

        if (!empty($conversationHistory)) {
            foreach ($conversationHistory as $message) {
                if ($this->isValidMessage($message)) {
                    $messages[] = [
                        "role" => $message["role"],
                        "content" => $message["content"]
                    ];
                }
            }
        }

        $messages[] = [
            "role" => "user",
            "content" => $userMessage
        ];

        return $messages;
    }


    private function isValidMessage(array $message): bool
    {
        return isset($message['role']) &&
               isset($message['content']) &&
               in_array($message['role'], ['user', 'assistant', 'system']);
    }

    private function extractResponse(array $apiResponse): string
    {
        if (!isset($apiResponse['choices'][0]['message']['content'])) {
            Log::error('Respuesta inválida de OpenRouter', ['response' => $apiResponse]);
            throw new \Exception('Respuesta inválida de la API');
        }

        return $apiResponse['choices'][0]['message']['content'];
    }
}
