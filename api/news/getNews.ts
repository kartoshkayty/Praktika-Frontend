import { http } from "../http";

export interface News {
  id: number;
  title: string;
  content: string;
  image: string | null;
  thumbnail: string | null;
  video_url: string | null;
  author: number;
  author_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const getNews = (): Promise<News[]> => {
  return new Promise((resolve, reject) => {
    http
      .get<News[]>("news/")
      .then((response) => resolve(response.data))
      .catch(reject);
  });
};

export { getNews };
