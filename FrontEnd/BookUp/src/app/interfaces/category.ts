export interface CategoryCreate {
  name: string;
}

export interface Category {
  id: number;
  name: string;
  user_id: number;
  book_count: number;
}

export interface BookInCategory {
  id: number;
  user_id: number;
  path: string;
  description?: string | null;
  review?: string | null;
  producer?: string | null;
  format?: string | null;
  encryption?: string | null;
  author?: string | null;
  mod_date?: string | null;
  keywords?: string | null;
  title?: string | null;
  creation_date?: string | null;
  creator?: string | null;
  subject?: string | null;
}

export interface MessageResponse {
  message: string;
}
