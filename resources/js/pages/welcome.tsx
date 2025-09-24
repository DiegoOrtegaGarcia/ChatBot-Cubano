import { ErrorMessage } from "@/core/components/ErrorMessage";
import { useWelcome } from "@/core/hooks/useWelcome";

export default function Welcome() {
    const {error,setError,messagesContainer,messages,messageElements,isThinking,sanitizedDisplayText,isCurrentViewFollow,handleTextContainerView,handleSubmit,setTextMessage,textMessage,textareaRef,isSubmitDisabled} = useWelcome()

    return (
        <main className="flex flex-col justify-center items-center  bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 gap-4 h-screen" role="main" aria-label="Aplicación de chat con Yosbani, asistente virtual">
            <ErrorMessage error={error} setError={setError}></ErrorMessage>
            <section className="w-11/12 flex justify-center bg-white/10 backdrop-blur-lg rounded-2xl h-10/12 border border-white/20 overflow-y-auto lg:w-10/12 overflow-x-hidden scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-purple-900/20" ref={messagesContainer}
                aria-label="Historial de conversación"
                aria-live="polite"
                aria-relevant="additions"
                tabIndex={0}
                role="log"
            >
                {messages.length < 1 ?
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div
                            className="text-center max-w-md"
                            aria-live="polite"
                        >
                            <div className="bg-gradient-to-r from-blue-900 to-purple-800 p-6 rounded-2xl shadow-2xl border border-white/20">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2">
                                    Hola, Soy Yasmani
                                </h2>
                                <p className="text-blue-100">
                                    Tu asistente virtual. ¿En qué puedo ayudarte hoy?
                                </p>
                            </div>
                        </div>
                    </div> :
                    <div className="flex flex-col gap-2 p-2 w-full"  role="list" >{
                        messageElements.map((mes, index) => (
                            <div key={index} role="listitem" aria-label={mes.isUser ? "Mensaje del usuario" : "Respuesta del asistente"}>
                                {mes.isUser ? (
                                    <div className="bg-gradient-to-r ml-4 from-blue-500  to-blue-600 p-2 text-white rounded-2xl rounded-br-none shadow-lg max-w-7/12 justify-self-end">
                                        <p>
                                            <p className="leading-relaxed">{mes.messages}</p>
                                        </p>
                                    </div>
                                ) : (
                                    <div className={
                                        mes.isLast
                                            ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white p-2 rounded-2xl rounded-bl-none shadow-lg max-w-7/12 justify-self-start  mr-4 mb-2"
                                            : "bg-gradient-to-r from-slate-800 to-slate-900 text-white p-2 rounded-2xl rounded-bl-none shadow-lg max-w-7/12 justify-self-start  mr-4"
                                    }>
                                        {mes.isLast ? (
                                            <div dangerouslySetInnerHTML={{ __html: sanitizedDisplayText }} aria-live="polite" aria-busy={isThinking} className="prose prose-invert max-w-none"></div>
                                        ) : (
                                            <div dangerouslySetInnerHTML={{ __html: String(mes.sanitizedContent) }} className="prose prose-invert max-w-none"></div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isThinking ? <div className="flex justify-start">
                                <div className="max-w-[80%] mr-4">
                                    <div
                                        className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-2 rounded-2xl rounded-bl-none shadow-lg"
                                        role="status"
                                        aria-live="polite"
                                        aria-label="El asistente está generando una respuesta"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                            <span className="text-blue-300 font-medium">Yasmani está pensando...</span>
                                        </div>
                                    </div>
                                </div>
                            </div> : ""}
                    </div>
                }
            </section>
            <button className={`absolute right-1/11 lg:bottom-2/11 mr-2  lg:p-2 z-10 rounded-full transition-all duration-300  p-1 bottom-3/12 ${
                    isCurrentViewFollow
                        ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25'
                        : 'bg-slate-700 hover:bg-slate-600 shadow-lg shadow-slate-500/25'
                } text-white border-2 border-white/20 backdrop-blur-sm`} onClick={handleTextContainerView}
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
                <form onSubmit={e => handleSubmit(e)} className=" bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-2  flex justify-center gap-1 items-end w-10/12"  noValidate>
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder="Ask anything"
                        onChange={e => setTextMessage(e.target.value)}
                        className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 p-1 rounded-xl border border-white/30 resize-none  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-purple-900/20"
                        value={textMessage}
                        style={{ minHeight: '44px', maxHeight: '100px' }}
                        aria-label="Escribe tu mensaje"
                        aria-describedby="textarea-instructions"
                        aria-required="true"
                        aria-invalid={error ? "true" : "false"}
                        aria-busy={isThinking}
                    />
                    <button type="submit" className={`p-2 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                                isSubmitDisabled
                                    ? 'bg-slate-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 shadow-lg hover:shadow-blue-500/25'
                            } text-white border-2 border-white/20 backdrop-blur-sm`} disabled={isSubmitDisabled}  aria-busy={isThinking}>
                        {isThinking ? (
                                <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                    </button>
                </form>
            </section>
            <footer className="text-center mt-2">
                <p className="text-white/40 text-sm">
                    Powered by AI • Seguro y privado
                </p>
            </footer>
        </main>
    );
}

