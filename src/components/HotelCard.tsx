import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Wifi, Dumbbell, Utensils, Waves, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  price: number;
  amenities: string[];
}

const HotelCard = ({ id, name, location, image, rating, price, amenities }: HotelCardProps) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: any) => fav.id === id));
  }, [id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      const updated = favorites.filter((fav: any) => fav.id !== id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: `${name} has been removed from your favorites`,
      });
    } else {
      const newFavorite = { id, name, location, image, rating, price, amenities };
      favorites.push(newFavorite);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: `${name} has been added to your favorites`,
      });
    }
  };

  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    gym: Dumbbell,
    restaurant: Utensils,
    pool: Waves,
  };

  return (
    <Card className="overflow-hidden hover-lift group border-accent/30 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all duration-300 bg-card">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-transform"
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Badge className="bg-accent text-accent-foreground flex items-center gap-1 shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            {rating}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 text-primary group-hover:text-accent transition-colors">{name}</h3>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1 text-accent" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex gap-3 mb-4">
          {amenities.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity.toLowerCase()] || Wifi;
            return (
              <div
                key={amenity}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors"
                title={amenity}
              >
                <Icon className="h-5 w-5 text-accent" />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="text-2xl font-bold text-primary">₹{price.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">per night</p>
          </div>
          
          <div className="flex gap-2">
           <Button
  variant="default"
  size="sm"
  asChild
  className="flex-1 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105"
>
  <Link to={`/hotel/${id}`}>View Details</Link>
</Button>
            {/* <Button variant="default" size="sm" asChild className="flex-1">
              <Link to={`/hotel/${id}`}>Book Now</Link>
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
