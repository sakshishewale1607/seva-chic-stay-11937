import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Rating } from "@/components/Rating";
import { ArrowLeft, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LeaveReview() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [overallRating, setOverallRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [locationRating, setLocationRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [comment, setComment] = useState("");

  // Mock booking data
  const booking = {
    hotelName: "Grand Plaza Hotel",
    roomType: "Deluxe Suite",
    checkIn: "2024-03-15",
    checkOut: "2024-03-18"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (overallRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide an overall rating",
        variant: "destructive"
      });
      return;
    }

    // In real app, this would submit to backend
    toast({
      title: "Review Submitted!",
      description: "Thank you for sharing your experience"
    });
    
    navigate("/my-bookings");
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-primary text-white py-6">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
            onClick={() => navigate("/my-bookings")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
          <h1 className="text-3xl font-bold">Share Your Experience</h1>
          <p className="text-white/80 mt-2">Help other travelers with your honest review</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto p-8">
          {/* Booking Info */}
          <div className="mb-8 pb-6 border-b">
            <h2 className="text-2xl font-bold text-primary mb-2">{booking.hotelName}</h2>
            <p className="text-muted-foreground">{booking.roomType}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {booking.checkIn} - {booking.checkOut}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Overall Rating */}
            <div className="text-center">
              <Label className="text-lg font-semibold mb-4 block">
                Overall Rating <span className="text-red-500">*</span>
              </Label>
              <div className="flex justify-center mb-2">
                <Rating
                  rating={overallRating}
                  size="lg"
                  interactive
                  onRatingChange={setOverallRating}
                />
              </div>
              {overallRating > 0 && (
                <p className="text-sm text-accent font-medium animate-fade-in">
                  {overallRating <= 2 ? "Poor" : overallRating <= 3 ? "Average" : overallRating <= 4 ? "Good" : "Excellent"}
                </p>
              )}
            </div>

            {/* Detailed Ratings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Rate Your Experience</h3>
              
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <span className="font-medium">Cleanliness</span>
                  <Rating
                    rating={cleanlinessRating}
                    interactive
                    onRatingChange={setCleanlinessRating}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <span className="font-medium">Service & Staff</span>
                  <Rating
                    rating={serviceRating}
                    interactive
                    onRatingChange={setServiceRating}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <span className="font-medium">Location</span>
                  <Rating
                    rating={locationRating}
                    interactive
                    onRatingChange={setLocationRating}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <span className="font-medium">Value for Money</span>
                  <Rating
                    rating={valueRating}
                    interactive
                    onRatingChange={setValueRating}
                  />
                </div>
              </div>
            </div>

            {/* Written Review */}
            <div>
              <Label htmlFor="comment" className="text-base font-semibold mb-2 block">
                Your Review
              </Label>
              <Textarea
                id="comment"
                placeholder="Share details about your stay - what you loved, what could be improved..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {comment.length}/1000 characters
              </p>
            </div>

            {/* Tips */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex gap-2 mb-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <h4 className="font-semibold text-accent">Tips for a great review</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                <li>• Be specific about what you liked or didn't like</li>
                <li>• Mention room cleanliness, staff behavior, and amenities</li>
                <li>• Be honest and constructive with your feedback</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/my-bookings")}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Review
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
