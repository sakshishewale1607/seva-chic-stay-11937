import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HotelCard from "@/components/HotelCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Filter, X } from "lucide-react";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = searchParams.get("location");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  // All available hotels
  const allHotels = [
    {
      id: "1",
      name: "Grand Luxury Hotel",
      location: "Mumbai, Maharashtra",
      image: hotel1,
      rating: 4.8,
      price: 5999,
      amenities: ["wifi", "gym", "restaurant", "pool"],
    },
    {
      id: "2",
      name: "Urban Boutique Hotel",
      location: "Pune, Maharashtra",
      image: hotel2,
      rating: 4.6,
      price: 4499,
      amenities: ["wifi", "restaurant", "gym"],
    },
    {
      id: "3",
      name: "Seaside Resort & Spa",
      location: "Goa, India",
      image: hotel3,
      rating: 4.9,
      price: 7999,
      amenities: ["wifi", "pool", "restaurant", "gym", "spa"],
    },
    {
      id: "4",
      name: "Heritage Palace Hotel",
      location: "Jaipur, Rajasthan",
      image: hotel1,
      rating: 4.7,
      price: 6499,
      amenities: ["wifi", "restaurant", "pool", "spa"],
    },
    {
      id: "5",
      name: "Mountain View Resort",
      location: "Shimla, Himachal Pradesh",
      image: hotel2,
      rating: 4.5,
      price: 5499,
      amenities: ["wifi", "restaurant", "gym"],
    },
    {
      id: "6",
      name: "Beach Paradise Hotel",
      location: "Kerala, India",
      image: hotel3,
      rating: 4.8,
      price: 7499,
      amenities: ["wifi", "pool", "restaurant", "spa"],
    },
    {
      id: "7",
      name: "Royal Heritage Inn",
      location: "Udaipur, Rajasthan",
      image: hotel1,
      rating: 4.9,
      price: 8999,
      amenities: ["wifi", "pool", "restaurant", "spa", "gym"],
    },
    {
      id: "8",
      name: "City Central Hotel",
      location: "Delhi, India",
      image: hotel2,
      rating: 4.4,
      price: 3999,
      amenities: ["wifi", "restaurant", "gym"],
    },
    {
      id: "9",
      name: "Lake View Resort",
      location: "Nainital, Uttarakhand",
      image: hotel3,
      rating: 4.6,
      price: 5999,
      amenities: ["wifi", "restaurant", "pool"],
    },
    {
      id: "10",
      name: "Business Suites Hotel",
      location: "Bangalore, Karnataka",
      image: hotel1,
      rating: 4.5,
      price: 4999,
      amenities: ["wifi", "gym", "restaurant"],
    },
    {
      id: "11",
      name: "Tropical Paradise Resort",
      location: "Andaman Islands",
      image: hotel2,
      rating: 4.9,
      price: 9999,
      amenities: ["wifi", "pool", "restaurant", "spa"],
    },
    {
      id: "12",
      name: "Historic Fort Hotel",
      location: "Jodhpur, Rajasthan",
      image: hotel3,
      rating: 4.7,
      price: 7999,
      amenities: ["wifi", "restaurant", "pool"],
    },
  ];

  const [filteredHotels, setFilteredHotels] = useState(allHotels);

  const amenitiesList = ["wifi", "pool", "gym", "restaurant", "spa"];
  const ratingsList = [4.5, 4.0, 3.5];

  useEffect(() => {
    let filtered = allHotels;

    // Filter by location
    if (location) {
      filtered = filtered.filter((hotel) =>
        hotel.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (hotel) => hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    );

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((hotel) =>
        selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
      );
    }

    // Filter by rating
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      filtered = filtered.filter((hotel) => hotel.rating >= minRating);
    }

    setFilteredHotels(filtered);
  }, [location, priceRange, selectedAmenities, selectedRatings]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 15000]);
    setSelectedAmenities([]);
    setSelectedRatings([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold mb-2">Search Results</h1>
            {location && (
              <p className="text-xl text-muted-foreground">
                Hotels in <span className="text-primary font-semibold">{location}</span>
              </p>
            )}
            {checkIn && checkOut && (
              <p className="text-muted-foreground">
                {checkIn} to {checkOut} • {guests || 2} guests
              </p>
            )}
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <Card className="w-80 p-6 h-fit sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-accent hover:text-accent-hover"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  Price Range
                </Label>
                <div className="mb-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={15000}
                    min={0}
                    step={500}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  Amenities
                </Label>
                <div className="space-y-3">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <label
                        htmlFor={amenity}
                        className="text-sm capitalize cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  Minimum Rating
                </Label>
                <div className="space-y-3">
                  {ratingsList.map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={selectedRatings.includes(rating)}
                        onCheckedChange={() => toggleRating(rating)}
                      />
                      <label
                        htmlFor={`rating-${rating}`}
                        className="text-sm cursor-pointer"
                      >
                        {rating}+ Stars
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Hotels Grid */}
          <div className="flex-1">
            {filteredHotels.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  Showing {filteredHotels.length} hotels
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} {...hotel} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">No Hotels Available</h2>
                <p className="text-muted-foreground mb-6">
                  No hotels match your current search criteria. Try adjusting your filters or search in a different location.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
