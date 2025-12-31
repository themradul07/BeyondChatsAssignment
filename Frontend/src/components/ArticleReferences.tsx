import { ExternalLink, BookOpen } from "lucide-react";
import { ArticleReference } from "@/types/article";

interface ArticleReferencesProps {
  references: ArticleReference[];
}

const ArticleReferences = ({ references }: ArticleReferencesProps) => {
  if (!references || references.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-xl font-semibold text-foreground">
          References
        </h3>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {references.map((ref, index) => (
          <a
            key={index}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 hover:bg-secondary transition-all duration-300"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ExternalLink className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {ref.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Source: {ref.source}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ArticleReferences;
