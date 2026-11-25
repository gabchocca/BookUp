export interface Book {
  title: string;
  author: string;
  description: string;
  review: string;
}

export interface BookRequest{
  title: string;
  author: string;
  description: string;
  review: string;
  path: string;
}

export interface BookEdit{
  title: string;
  description: string;
  review: string;
}
