
export interface Message {
  role: "user" | "assistant";
  content?: string;
  messages?: string;
  timestamp?: number;
}

export interface SanitizedMessage extends Message {
  isLast: boolean;
  isUser: boolean;
  sanitizedContent: string |TrustedHTML| null;
  id: string | number;
}
