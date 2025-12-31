export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  reading_time: number;
  featured_image: string;
  category: string;
  is_enhanced: boolean;
  original_article_id?: number;
  references?: ArticleReference[];
}

export interface ArticleReference {
  title: string;
  url: string;
  source: string;
}

export interface ArticlePair {
  original: Article;
  enhanced?: Article;
}

export interface ArticlesResponse {
  title?: string,
  oldcontent?: String,
  content?: String,
  link?: String,
  isUpdated?: { type: Boolean, default: false },
  references?: [String],
  date?: String,
  author?: String,
  id?: String
  image?: string

}