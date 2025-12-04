import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import HotelCard from "@/components/HotelCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import heroImage from "@/assets/hero-hotel.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import { ArrowRight, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // 🧾 User & Booking Info
  const currentUser = localStorage.getItem("currentUser");
  const isLoggedIn = !!currentUser;
  const bookingHistory = JSON.parse(localStorage.getItem("bookings") || "[]");
  const userBookings = isLoggedIn
    ? bookingHistory.filter((booking: any) => booking.userId === currentUser)
    : [];
  const isFirstTimeBooker = isLoggedIn && userBookings.length === 0;
  const isSpecialGuest = isLoggedIn && userBookings.length >= 3;

  const offerShownKey = `offerShown_${currentUser}`;
  const hasShownOffer = sessionStorage.getItem(offerShownKey);
  const [showOfferDialog, setShowOfferDialog] = useState(
    (isFirstTimeBooker || isSpecialGuest) && !hasShownOffer
  );

  const handleCloseOffer = () => {
    if (currentUser) {
      sessionStorage.setItem(offerShownKey, "true");
    }
    setShowOfferDialog(false);
  };

  // 🏨 Featured Hotels Data
  const featuredHotels = [
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
      amenities: ["wifi", "pool", "restaurant", "gym"],
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
      location: "Manali, Himachal Pradesh",
      image: hotel2,
      rating: 4.5,
      price: 5499,
      amenities: ["wifi", "restaurant", "gym"],
    },
    {
      id: "6",
      name: "Business Suites Hotel",
      location: "Bangalore, Karnataka",
      image: hotel3,
      rating: 4.6,
      price: 4999,
      amenities: ["wifi", "gym", "restaurant"],
    },
  ];

  // ✅ Search Validation Before Navigate
  const handleSearch = (
    location: string,
    checkIn: string,
    checkOut: string,
    guests: number
  ) => {
    if (!location || !checkIn || !checkOut || !guests) {
      toast({
        title: "Missing Information",
        description: "Please fill all the fields before searching for hotels.",
        variant: "destructive",
      });
      return;
    }

    const params = new URLSearchParams({
      location,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleExploreHotels = () => {
    localStorage.setItem("hasVisited", "true");
    navigate("/search");
  };

  // ✨ Review Form Handler
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback 💛",
    });
    setRating(0);
    setReviewText("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 💎 Hero Offers Section */}
<section
  className="relative bg-cover bg-center bg-no-repeat py-24 overflow-hidden"
  style={{ backgroundImage: `url(${heroImage})` }}
>
  {/* Overlay for contrast */}
  <div className="absolute inset-0 bg-[#0D2A47]/70 backdrop-blur-[2px]"></div>

  {/* Heading */}
  <div className="relative text-center mb-12 z-10">
    <h1 className="text-5xl md:text-6xl font-extrabold text-[#F3EBDD] mb-4 tracking-tight drop-shadow-lg">
      Discover Your Perfect Stay
    </h1>
    <p className="text-xl md:text-2xl text-[#EADFC7] font-medium">
      Exclusive offers curated just for you ✨
    </p>
  </div>

  {/* Offers Cards Slider */}
  <div className="relative w-full max-w-7xl mx-auto overflow-hidden px-6 z-10">
    <div
      className="flex gap-8 animate-slide-seamless hover:[animation-play-state:paused]"
      style={{ animation: "slide-seamless 45s linear infinite" }}
    >
      {[...Array(2)].map((_, i) => (
        <React.Fragment key={i}>
          {[
            {
              emoji: "🏖️",
              title: "Beachside Retreat",
              desc: "Flat 40% off for Goa resorts",
            },
            {
              emoji: "💎",
              title: "Elite Member Deals",
              desc: "Access secret luxury discounts",
            },
            {
              emoji: "🎁",
              title: "Welcome Offer",
              desc: "Use code WELCOME50 and save big!",
            },
            {
              emoji: "🏔️",
              title: "Mountain Escape",
              desc: "Luxury stays from ₹4,999",
            },
            {
              emoji: "🏨",
              title: "Weekend Getaway",
              desc: "Stay 2 nights, get 1 free",
            },
          ].map((offer, idx) => (
            <div
              key={idx}
              className="min-w-[370px] rounded-3xl px-8 py-6 
                         backdrop-blur-md bg-white/10 border border-[#C4BBA8]/40
                         shadow-[0_8px_30px_rgba(0,0,0,0.2)]
                         hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]
                         hover:-translate-y-1.5 hover:bg-white/20
                         transition-all duration-700 cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <span className="text-5xl drop-shadow-md">{offer.emoji}</span>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-[#F3EBDD] mb-1">
                    {offer.title}
                  </h3>
                  <p className="text-[#EADFC7]/90 text-sm">{offer.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>

    {/* Gradients on edges for smooth fade */}
    <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#0D2A47] to-transparent pointer-events-none"></div>
    <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#0D2A47] to-transparent pointer-events-none"></div>
  </div>
</section>


      {/* 🔍 Search Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* 🏨 Featured Hotels */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Hotels</h2>
          <p className="text-xl text-muted-foreground">
            Handpicked luxury stays for your perfect getaway
          </p>
        </div>

        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent className="-ml-4">
            {featuredHotels.map((hotel) => (
              <CarouselItem
                key={hotel.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <HotelCard {...hotel} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </Carousel>
      </section>

      {/* 🌟 Why Choose Us */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose SevaStay?</h2>
            <p className="text-xl text-muted-foreground">
              Your trusted partner for unforgettable hotel experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🏆", title: "Best Price Guarantee", text: "We guarantee the lowest prices on all hotel bookings" },
              { icon: "⭐", title: "Verified Reviews", text: "Read authentic reviews from real guests" },
              { icon: "💳", title: "Secure Booking", text: "Safe and secure payment options for peace of mind" },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📝 Review Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Your Review
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Share your experience with SevaStay
            </p>
          </div>

          <Card className="max-w-2xl mx-auto p-8">
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div>
                <Label className="text-lg mb-3 block text-center">
                  Rate Your Experience
                </Label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= rating
                            ? "fill-accent text-accent"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="review">Your Feedback</Label>
                <Textarea
                  id="review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about your experience with SevaStay..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Review
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* 🔚 Footer */}
      <Footer />
    </div>
  );
};

export default Index;
