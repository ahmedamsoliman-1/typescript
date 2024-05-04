// Content.ts

export interface Content {
    id: string;
    title: string;
    type: string;
    author_id: string;
    content: string;
    created_at: Date;
    published: boolean;
    published_at?: Date;
    updated_at?: Date;
    version_history?: any[];
  }
  