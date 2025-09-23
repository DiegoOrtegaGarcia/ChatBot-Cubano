import { useMemo } from "react";

export const ErrorMessage =({error,setError}) => useMemo(() => {
        if (!error) return null;

        return (
            <div
                className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md animate-fade-in"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                tabIndex={-1}
            >
                <div className="flex items-center justify-between">
                    <span>{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="ml-4 text-white hover:text-gray-200 text-xl font-bold"
                        aria-label="Cerrar mensaje de error"
                    >
                        ×
                    </button>
                </div>
            </div>
        );
}, [error]);
