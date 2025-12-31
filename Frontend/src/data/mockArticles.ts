import { Article, ArticlePair, ArticlesResponse } from "@/types/article";
import axios from "axios";


// Extract all featured_image URLs from mockArticles
export const articleImages = [
  "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop"
];

// Get a random image URL from the extracted article images
export const getRandomImg = (): string => {
  const randomIndex = Math.floor(Math.random() * articleImages.length);
  return articleImages[randomIndex];
};



export const getArticlePairs = async (): Promise<number> => {
  try {
    const response = await axios.get('http://localhost:5000/api/scrape/find-articles');
    const len = response.data.length;
    console.log("Fetched article pairs length:", len);
    return len as number;
  } catch (error) {
    console.error("Error fetching article pairs:", error);
    return -1;
  }
};

export const getArticleById = async (id: string): Promise<ArticlesResponse | undefined> => {
  const res = await axios.get(`http://localhost:5000/api/articles/${id}`);
  console.log("Fetched article by id:", res.data);
  return res.data;
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  return mockArticles.find((a) => a.slug === slug);
};

export const UpdateAllArticles = async (): Promise<{ message: string, articles: ArticlesResponse[], error?: string }> => {
  try {
    const response = await axios.get('http://localhost:5000/api/scrape/update-articles');
    return response.data;
  } catch (error) {
    console.error("Error updating articles:", error);
    throw error;
  }
};

export const getArticleCards = async (): Promise<ArticlesResponse[]> => {
  try {
    const res = await axios.get('http://localhost:5000/api/articles/cards');
    console.log("Fetched article cards:", res.data);
    return res.data;
  } catch {
    return [];
  }
}

export const deleteArticleById = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/articles/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};