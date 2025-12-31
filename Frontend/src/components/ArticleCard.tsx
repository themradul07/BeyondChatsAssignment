import { Link } from "react-router-dom";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArticlePair, ArticlesResponse } from "@/types/article";
import { stringify } from "querystring";
import { getRandomImg } from "@/data/mockArticles";

interface ArticleCardProps {
  articlePair: ArticlesResponse;
  index: number;
}

const ArticleCard = ({ articlePair, index }: ArticleCardProps) => {
  const { oldcontent, content } = articlePair;
  console.log("Rendering ArticleCard with articlePair:", articlePair);
  articlePair.image = getRandomImg();

  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-card transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Featured Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={articlePair.image}
          alt={articlePair.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        {/* <div className="absolute top-4 left-4">
          <Badge variant="category">{oldcontent.category}</Badge>
        </div> */}

        {/* content Badge */}
        {content && (
          <div className="absolute top-4 right-4">
            <Badge variant="content" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI content
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {articlePair.title}
        </h2>

        {/* <p className="text-muted-foreground text-sm md:text-base line-clamp-3 mb-4">
          {oldcontent.excerpt}
        </p> */}

        {/* Meta Info */}
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">{oldcontent.author}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{oldcontent.reading_time} min read</span>
            </div>
          </div> */}

          <Link
            to={`/article/${articlePair.id}`}
            className="flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all"
          >
            Read <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
