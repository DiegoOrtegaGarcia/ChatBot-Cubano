import api from "@/core/axios/axios";
import { useEffect, useRef, useState, useCallback, useMemo, FormEvent } from "react";
import DOMPurify from 'dompurify';
import { ERROR_MESSAGES, HTML_SANITIZED_RULES } from "../constants/constants";
import { AxiosError } from "axios";
import { Message, SanitizedMessage } from "../types/types";


export const useWelcome = () => {
    const [textMessage, setTextMessage] = useState("")
    const [messages, setMessages] =  useState<Message[]>([])
    const [isThinking, setIsThinking] = useState(false)
    const [botResponse, setBotResponse] = useState("")
    const [displayText, setDisplayText] = useState('')
    const [isCurrentViewFollow, setIsCurrentViewFollow] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const messagesContainer = useRef<HTMLElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const isCurrentViewFollowRef = useRef(isCurrentViewFollow)

    const lastMessageIndex = messages.length - 1;

    //Callbacks
    const handleError = useCallback((error :AxiosError, context = '') => {
        console.error(`Error en ${context}:`, error?.message, error);

        const status = error.response?.status;
        const message = error.message?.toLowerCase() || '';
        const code = error.code || '';

        let errorType = 'UNKNOWN_ERROR';

        switch (true) {
            case !navigator.onLine:
            case code === 'NETWORK_ERROR':
            case message.includes('failed to fetch'):
            case message.includes('network error'):
                errorType = 'NETWORK_ERROR';
                break;

            case status === 429:
                errorType = 'RATE_LIMIT';
                break;

            case status === 400:
                errorType = 'VALIDATION_ERROR';
                break;

            case status === 401:
                errorType = 'AUTH_ERROR';
                break;

            case status === 403:
                errorType = 'PERMISSION_ERROR';
                break;

            case status === 404:
                errorType = 'NOT_FOUND_ERROR';
                break;

            case status !== undefined && status >= 500:
                errorType = 'SERVER_ERROR';
                break;

            case message.includes('timeout'):
            case message.includes('timed out'):
                errorType = 'TIMEOUT_ERROR';
                break;

            case message.includes('cancel'):
                errorType = 'CANCELLED_ERROR';
                break;

            default:
                errorType = 'UNKNOWN_ERROR';
        }

        const userMessage = ERROR_MESSAGES[errorType as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.UNKNOWN_ERROR;

        setError(userMessage);
        setTimeout(() => setError(null), 5000);

        return userMessage;
    }, []);

    const sanitizeHTML = useCallback((html : string) => {
        return DOMPurify.sanitize(html, HTML_SANITIZED_RULES);
    }, []);


    const handleSubmit = useCallback(async (e : FormEvent) => {
        e.preventDefault()

        if (textMessage.trim().length < 1) {
            setError(ERROR_MESSAGES.VALIDATION_ERROR);
            return;
        }

        try {
            setIsThinking(true)
            setError(null)

            const userMessage : Message = {
                role: "user",
                messages: textMessage,
            };
            setMessages(prev => [...prev, userMessage])
            setTextMessage("")

            const response = await api.post("roselia", {
                message: textMessage,
                conversation_history: messages
            })

            setBotResponse(response.data.response)

            const assistantMessage : Message = {
                role: "assistant",
                content: response.data.response,
            };

            setMessages(prev => [...prev, assistantMessage])

            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch (error : any) {
            if (error.name === 'AbortError') {
                console.log('Request cancelado');
                return;
            }
            handleError(error, 'handleSubmit');

        } finally {
            setIsThinking(false);
        }
    }, [textMessage, isThinking, messages, handleError]);

    const adjustTextareaHeight = useCallback(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, []);


    const handleTextContainerView = useCallback(() => {
        adjustViewMessages()
        setIsCurrentViewFollow(prev => !prev)
    }, []);


    const adjustViewMessages = useCallback(() => {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }, []);

    //Memos

    const messageElements = useMemo((): SanitizedMessage[] => {
    return messages.map((mes, index) => ({
        ...mes,
        id: mes.timestamp || index,
        isLast: index === lastMessageIndex,
        isUser: mes.role === "user",
        sanitizedContent: mes.role === "assistant" ? sanitizeHTML(mes.content || '') : null
    }));
}, [messages, lastMessageIndex, sanitizeHTML]);

    const isSubmitDisabled = useMemo(() => {
        return textMessage.length < 1 || isThinking;
    }, [textMessage.length, isThinking]);

    const sanitizedDisplayText = useMemo(() => {
        return sanitizeHTML(displayText);
    }, [displayText, sanitizeHTML]);

    //Effects
    useEffect(() => {
        adjustTextareaHeight();
    }, [textMessage, adjustTextareaHeight]);

    useEffect(() => {
        isCurrentViewFollowRef.current = isCurrentViewFollow
    }, [isCurrentViewFollow])

    useEffect(() => {
        if (!botResponse) return;

        let i = 0;
        const speed = 30;
        setDisplayText("<p")

        const typingInterval = setInterval(() => {
            if (i < botResponse.length) {
                setDisplayText(prevText => prevText + botResponse.charAt(i));
                i++;
                if (isCurrentViewFollowRef.current) {
                    adjustViewMessages();
                }
            } else {
                clearInterval(typingInterval);
            }
        }, speed);

        return () => {
            clearInterval(typingInterval);
        };
    }, []);

    return{
        error,setError,messagesContainer,messages,messageElements,isThinking,sanitizedDisplayText,isCurrentViewFollow,handleTextContainerView,handleSubmit,setTextMessage,textMessage,textareaRef,isSubmitDisabled
    }
}
