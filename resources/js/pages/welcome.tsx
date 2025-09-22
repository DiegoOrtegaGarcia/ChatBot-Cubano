import api from "@/core/axios/axios";
import { useEffect, useRef, useState } from "react";

export default function Welcome() {
    const [textMessage, setTextMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [isThinking, setIsThinking] = useState(false)
    const messagesContainer = useRef(null)
    const textareaRef = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setIsThinking(true)
            setMessages(prev => [...prev, { role: "user", messages: textMessage }])
            setTextMessage("")
            const response = await api.post("roselia", { message: textMessage, conversation_history: messages })
            setMessages(prev => [...prev, { role: "assistant", content: response.data.response }])
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        } catch {
            alert("Discupe Hubo un error Con su mensaje intentelo de nuevo,sino intentelo mas tarde")
        } finally {
            setIsThinking(false)
        }
    }

    // Función para ajustar la altura del textarea automáticamente
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }

    useEffect(() => {
        adjustTextareaHeight();
    }, [textMessage]);

    useEffect(() => {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }, [messages]);

    return (
        <main className="flex flex-col justify-center items-center bg-gray-700 h-screen gap-2">
            <section className="w-11/12 flex justify-center bg-gray-600 rounded-2xl h-10/12 border overflow-y-auto lg:w-10/12" ref={messagesContainer}>
                {messages.length < 1 ? <p className="text-xl font-bold text-amber-50 text-shadow-2xs">Hola Soy Yosbani tu asistente Virtual dime en que puedo ayudarte </p> :
                    <div className="flex flex-col gap-2 p-2 w-full">{
                        messages.map((mes, index) => (
                            <div key={index}>{mes.role === "user" ? <div className="bg-blue-300 text-black p-2 rounded-b-2xl rounded-tl-2xl max-w-7/12 justify-self-end"><p className={index === messages.length - 1 ? "mb-5" : ""}>{mes.messages}</p> </div> : <div className={index === messages.length - 1 ? "bg-blue-950 text-white p-1 rounded-b-2xl rounded-tr-2xl max-w-8/12 justify-self-start whitespace-pre-line mb-5" : "bg-blue-950 text-white p-1 rounded-b-2xl rounded-tr-2xl max-w-8/12 justify-self-start  whitespace-pre-line"}><p dangerouslySetInnerHTML={{ __html: mes.content }}></p></div>}</div>
                        ))}
                        {isThinking ? <div className="bg-blue-950 text-white p-1 rounded-b-2xl rounded-tr-2xl max-w-8/12 justify-self-start  whitespace-pre-line mb-5"><p className="text-white">Pensando ...</p></div> : ""}
                    </div>
                }

            </section>
            <section className="flex w-full justify-center">
                <form onSubmit={e => handleSubmit(e)} className="w-full flex justify-center gap-1 items-end">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder="Ask anything"
                        onChange={e => setTextMessage(e.target.value)}
                        className="bg-gray-400 p-2 whitespace-pre-wrap rounded-2xl w-7/12 border resize-none"
                        value={textMessage}
                        style={{ minHeight: '44px', maxHeight: '100px' }}
                    />
                    <button type="submit" className="bg-blue-600 p-1 rounded-2xl rounded-r-4xl text-amber-50 hover:bg-blue-700 active:bg-blue-500 disabled:bg-gray-600 h-10" disabled={textMessage.length < 1 || isThinking ? true : false}>
                        {isThinking ?
                            <svg className="animate-spin w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            :
                            <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>}
                    </button>
                </form>
            </section>
        </main>
    );
}
