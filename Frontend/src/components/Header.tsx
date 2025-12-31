import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero shadow-soft group-hover:shadow-card transition-all duration-300">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-semibold text-foreground">
            BeyondChats
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Articles
          </Link>
          <a
            href="https://beyondchats.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            About
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/setup">
            <Button variant="pill" size="sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-6">
            <Link
              to="/"
              className="text-foreground font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Articles
            </Link>
            <a
              href="https://beyondchats.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium py-2"
            >
              About
            </a>
            <Link to="/setup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="hero" size="lg" className="mt-2 w-full">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
