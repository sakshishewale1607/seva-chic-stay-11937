import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const Rating = ({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showNumber = false,
  interactive = false,
  onRatingChange
}: RatingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        const isPartial = starValue > rating && starValue - 1 < rating;
        
        return (
          <button
            key={i}
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={cn(
              "relative transition-all duration-200",
              interactive && "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-all duration-200",
                isFilled ? "fill-accent text-accent" : "text-muted-foreground/40"
              )}
            />
            {isPartial && (
              <Star
                className={cn(
                  sizeClasses[size],
                  "absolute top-0 left-0 fill-accent text-accent"
                )}
                style={{ clipPath: `inset(0 ${(1 - (rating % 1)) * 100}% 0 0)` }}
              />
            )}
          </button>
        );
      })}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
