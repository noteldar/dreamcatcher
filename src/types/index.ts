export interface ParagraphDocument {
    _id?: string; // MongoDB ObjectId
    id: string;
    persona_name: string;
    persona_id: string;
    book: string;
    paragraph_index: number;
    paragraph: string;
    emotion: string;
    emotion_level: number;
    justification: string;
} 
