import { getArticleCards} from "@/data/mockArticles";
import ArticleCard from "./ArticleCard";
import { ArticlesResponse } from "@/types/article";
import { useEffect, useState } from "react";

const ArticleList = () => {
  const [articles, setArticles] = useState<ArticlesResponse[]>([]);

  const fetchArticles = async () => {
    try {
      const fetchedArticles = await getArticleCards();
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <section id="articles" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest Articles
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our collection of articles. Each piece is available in its original
            form and an AI-enhanced version with improved structure and depth.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <ArticleCard key={index} articlePair={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleList;
