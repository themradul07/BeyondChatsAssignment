import { Sparkles, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface VersionToggleProps {
  isEnhanced: boolean;
  onToggle: (enhanced: boolean) => void;
  hasEnhanced: boolean;
}

const VersionToggle = ({ isEnhanced, onToggle, hasEnhanced }: VersionToggleProps) => {
  if (!hasEnhanced) return null;

  return (
    <div className="inline-flex items-center p-1 rounded-full bg-secondary border border-border">
      <button
        onClick={() => onToggle(false)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
          !isEnhanced
            ? "bg-card text-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <FileText className="h-4 w-4" />
        Original
      </button>
      <button
        onClick={() => onToggle(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
          isEnhanced
            ? "bg-primary text-primary-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sparkles className="h-4 w-4" />
        AI Enhanced
      </button>
    </div>
  );
};

export default VersionToggle;
