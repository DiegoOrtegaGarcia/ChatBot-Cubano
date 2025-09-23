export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Error de conexión. Verifique su internet e intente nuevamente.",
    SERVER_ERROR: "El servidor no responde. Intente más tarde.",
    VALIDATION_ERROR: "El mensaje no puede estar vacío.",
    UNKNOWN_ERROR: "Error inesperado. Intente nuevamente.",
    RATE_LIMIT: "Demasiadas solicitudes. Espere un momento.",
    TIMEOUT_ERROR: "La solicitud tardó demasiado. Intente nuevamente.",
    AUTH_ERROR: "Error de autenticación. Verifique sus credenciales.",
    PERMISSION_ERROR: "No tiene permisos para esta acción.",
    NOT_FOUND_ERROR: "Recurso no encontrado.",
    CANCELLED_ERROR: "Solicitud cancelada."
};

export const HTML_SANITIZED_RULES = {
        ALLOWED_TAGS: ['p', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'br'],
        ALLOWED_ATTR: ['class'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['onclick', 'onload', 'onerror', 'style']
};
