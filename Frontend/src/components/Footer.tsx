import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-semibold text-foreground">
              BeyondChats
            </span>
          </div>

          <p className="text-sm text-muted-foreground text-center md:text-left">
            AI-powered content enhancement for modern blogs
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://beyondchats.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Website
            </a>
            <a
              href="https://beyondchats.com/blogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BeyondChats. Full Stack Developer Assignment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
