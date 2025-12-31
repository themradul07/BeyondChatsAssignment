import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Calendar, User, Trash2 } from "lucide-react";
import { deleteArticleById, getArticleById, getRandomImg, mockArticles } from "@/data/mockArticles";
import { Article } from "@/types/article";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VersionToggle from "@/components/VersionToggle";
import ArticleReferences from "@/components/ArticleReferences";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [article, setArticle] = useState<String | null>(null);
  const [enhancedArticle, setEnhancedArticle] = useState<String | null>(null);
  const [title, settitle] = useState("")
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchArticle = async () => {
    if (id) {
      const fetchedArticle = await getArticleById(id);
      settitle(fetchedArticle.title|| "Title")
      setArticle(fetchedArticle.oldcontent || null);
      setEnhancedArticle(fetchedArticle.content || null);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this article?")) return;

    setIsDeleting(true);
    try {
      const deleteResponse = await deleteArticleById(id);
      if(!deleteResponse){
        alert("Failed to delete article");
        setIsDeleting(false);
        return;
      }
      console.log("Article deleted:", id);
      window.location.href = "/";
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <Link to="/">
              <Button variant="hero">Back to Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayArticle = isEnhanced && enhancedArticle ? enhancedArticle : article;
  const randImg = getRandomImg();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={randImg}
            alt={"Article Hero"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Article Content */}
        <article className="container mx-auto px-4 md:px-6 -mt-32 relative z-10 max-w-5xl overflow-hidden">
          <div className="max-w-3xl mx-auto">
            {/* Back Link + Delete Button */}
            <div className="flex justify-between items-start mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Articles</span>
              </Link>

              {/* Delete Button - Top Right */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 h-9 px-3"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={handleDelete} 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Article"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Article Card */}
            <div className="bg-card rounded-2xl shadow-elevated p-6 md:p-10 animate-fade-in-up">
              {/* Version Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                {/* <Badge variant="category">{displayArticle.category}</Badge> */}
                <VersionToggle
                  isEnhanced={isEnhanced}
                  onToggle={setIsEnhanced}
                  hasEnhanced={!!enhancedArticle}
                />
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
                {/* <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{"displayArticle.author"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(displayArticle.published_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{displayArticle.reading_time} min read</span>
                </div> */}
              </div>

      {/* \
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                {displayArticle.excerpt}
              </p> */}

          
              {/* <div>
                {displayArticle}
              </div> */}
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: displayArticle }}
              />

              {/* References (only for enhanced articles) */}
              {/* {isEnhanced && enhancedArticle?.references && (
                <ArticleReferences references={enhancedArticle.references} />
              )} */}
            </div>
          </div>
        </article>

        {/* Spacer */}
        <div className="py-16 md:py-24" />
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
