import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SearchBarProps {
  onSearch?: (location: string, checkIn: string, checkOut: string, guests: number) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(location, checkIn, checkOut, guests);
    }
  };

  return (
    <Card className="p-6 bg-card shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Location
          </label>
          <Input
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Check-in
          </label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Check-out
          </label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Guests
          </label>
          <Input
            type="number"
            min="1"
            max="10"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            className="w-full"
          />
        </div>
      </div>

      <Button 
        onClick={handleSearch}
        size="lg" 
        className="w-full mt-6"
      >
        <Search className="mr-2 h-5 w-5" />
        Search Hotels
      </Button>
    </Card>
  );
};

export default SearchBar;
