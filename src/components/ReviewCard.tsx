import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rating } from "@/components/Rating";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";

interface ReviewCardProps {
  name: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  roomType?: string;
  verified?: boolean;
  helpful?: number;
}

export const ReviewCard = ({
  name,
  avatar,
  rating,
  date,
  comment,
  roomType,
  verified = false,
  helpful = 0
}: ReviewCardProps) => {
  const [helpfulCount, setHelpfulCount] = useState(helpful);
  const [isHelpful, setIsHelpful] = useState(false);

  const handleHelpful = () => {
    if (!isHelpful) {
      setHelpfulCount(prev => prev + 1);
      setIsHelpful(true);
    }
  };

  return (
    <Card className="p-6 hover-lift border-accent/20">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12 border-2 border-accent/30">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-accent/20 text-accent font-semibold">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground">{name}</h4>
                {verified && (
                  <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                    Verified Stay
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Rating rating={rating} size="sm" />
                <span className="text-xs text-muted-foreground">• {date}</span>
              </div>
              {roomType && (
                <p className="text-xs text-muted-foreground mb-2">
                  Stayed in: {roomType}
                </p>
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {comment}
          </p>
          
          <button
            onClick={handleHelpful}
            className={`flex items-center gap-1 text-xs transition-colors ${
              isHelpful 
                ? "text-accent" 
                : "text-muted-foreground hover:text-accent"
            }`}
          >
            <ThumbsUp className={`w-3 h-3 ${isHelpful ? "fill-accent" : ""}`} />
            Helpful ({helpfulCount})
          </button>
        </div>
      </div>
    </Card>
  );
};
