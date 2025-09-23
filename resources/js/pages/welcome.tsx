import { ErrorMessage } from "@/core/components/ErrorMessage";
import { useWelcome } from "@/core/hooks/useWelcome";

export default function Welcome() {
    const {error,setError,messagesContainer,messages,messageElements,isThinking,sanitizedDisplayText,isCurrentViewFollow,handleTextContainerView,handleSubmit,setTextMessage,textMessage,textareaRef,isSubmitDisabled} = useWelcome()

    return (
        <main className="flex flex-col justify-center items-center bg-gray-700 h-screen gap-2" role="main" aria-label="Aplicación de chat con Yosbani, asistente virtual">
            <ErrorMessage error={error} setError={setError}></ErrorMessage>
            <section className="w-11/12 flex justify-center  bg-gray-600 rounded-2xl h-10/12 border overflow-y-auto lg:w-10/12" ref={messagesContainer}
                aria-label="Historial de conversación"
                aria-live="polite"
                aria-relevant="additions"
                tabIndex={0}
                role="log"
            >
                {messages.length < 1 ? <div
                        className="lg:text-xl font-bold text-amber-50 text-shadow-2xs p-4"
                        aria-live="polite"
                    >
                        <p className="bg-blue-700 p-2 rounded-xl shadow-2xl shadow-blue-900 border border-black">Hola, Soy Yosbani tu asistente Virtual. ¿En qué puedo ayudarte?</p>
                    </div> :
                    <div className="flex flex-col gap-2 p-2 w-full"  role="list" >{
                        messageElements.map((mes, index) => (
                            <div key={index} role="listitem" aria-label={mes.isUser ? "Mensaje del usuario" : "Respuesta del asistente"}>
                                {mes.isUser ? (
                                    <div className="bg-blue-300 text-black p-2 rounded-b-2xl rounded-tl-2xl max-w-7/12 justify-self-end">
                                        <p>
                                            {mes.messages}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={
                                        mes.isLast
                                            ? "bg-blue-950 text-white p-2 rounded-b-2xl rounded-tl-2xl max-w-7/12 justify-self-start whitespace-pre-line mb-5 "
                                            : "bg-blue-950 text-white p-2 rounded-b-2xl rounded-tl-2xl max-w-7/12 justify-self-start whitespace-pre-line"
                                    }>
                                        {mes.isLast ? (
                                            <div dangerouslySetInnerHTML={{ __html: sanitizedDisplayText }} aria-live="polite" aria-busy={isThinking}></div>
                                        ) : (
                                            <div dangerouslySetInnerHTML={{ __html: String(mes.sanitizedContent) }}></div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isThinking ? <div className="bg-blue-950 text-white p-1 rounded-b-2xl rounded-tr-2xl max-w-8/12 justify-self-start  whitespace-pre-line mb-5" role="status" aria-live="polite" aria-label="El asistente está generando una respuesta"><p className="text-white flex items-center">
                                    <span className="animate-pulse">Pensando</span>
                                    <span className="flex ml-2">
                                        <span className="animate-bounce">.</span>
                                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                                        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                                    </span>
                                </p></div> : ""}
                    </div>
                }
            </section>
            <button className="absolute right-1/11 bottom-2/12 mr-2 bg-blue-700 lg:p-2 rounded-full p-1 text-white border border-blue-500 shadow-sm shadow-blue-500 hover:bg-blue-800 active:bg-blue-400" onClick={handleTextContainerView}
            aria-label={isCurrentViewFollow ? "Scroll automático activado. Click para desactivar el seguimiento automático del scroll" : "Scroll automático desactivado. Click para activar el seguimiento automático del scroll"}
                aria-pressed={isCurrentViewFollow}
                title={isCurrentViewFollow ? "Scroll automático: ACTIVADO" : "Scroll automático: DESACTIVADO"}><svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg></button>
            <section className="flex w-full justify-center">
                <form onSubmit={e => handleSubmit(e)} className="w-full flex justify-center gap-1 items-end"  noValidate>
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder="Ask anything"
                        onChange={e => setTextMessage(e.target.value)}
                        className="bg-gray-400 p-2 whitespace-pre-wrap rounded-2xl w-7/12 border resize-none"
                        value={textMessage}
                        style={{ minHeight: '44px', maxHeight: '100px' }}
                        aria-label="Escribe tu mensaje"
                        aria-describedby="textarea-instructions"
                        aria-required="true"
                        aria-invalid={error ? "true" : "false"}
                        aria-busy={isThinking}
                    />
                    <button type="submit" className="bg-blue-600 p-1 rounded-2xl rounded-r-4xl text-amber-50 hover:bg-blue-700 active:bg-blue-500 disabled:bg-gray-600 h-10" disabled={isSubmitDisabled}  aria-busy={isThinking}>
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
