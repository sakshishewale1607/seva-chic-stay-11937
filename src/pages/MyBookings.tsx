import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CancelBookingDialog } from "@/components/CancelBookingDialog";
import Footer from "@/components/Footer";
import { Rating } from "@/components/Rating";
import HotelCard from "@/components/HotelCard";
import { useToast } from "@/hooks/use-toast";
import { calculateRefund } from "@/utils/refundPolicy";
import {
  Calendar,
  MapPin,
  Users,
  Receipt,
  XCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Search,
  Heart,
} from "lucide-react";
import hotelImage from "@/assets/hotel-1.jpg";

export default function MyBookings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState("");
  const [trackedBooking, setTrackedBooking] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
    }
    
    // Load favorites
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
  }, [navigate]);
  
  // Get current user's bookings from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  
  // Filter bookings for current user
  const userBookings = allBookings.filter((booking: any) => 
    booking.user?.email === currentUser.email
  );
  
  const [bookings, setBookings] = useState(() => {
    const active = userBookings
      .filter((b: any) => b.status === "confirmed" || b.status === "active")
      .map((b: any) => ({
        id: b.id,
        hotelName: b.hotelName,
        location: b.location || "India",
        roomType: b.roomType,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        guests: b.guests,
        status: "active",
        total: parseFloat(b.totalAmount),
        image: hotelImage,
        bookingDate: b.bookingDate || new Date().toISOString(),
      }));
    
    return {
      active,
      past: [],
      cancelled: [],
    };
  });

  const stats = {
    totalBookings: bookings.active.length + bookings.past.length + bookings.cancelled.length,
    activeBookings: bookings.active.length,
    completed: bookings.past.length,
    totalSpent: bookings.past.reduce((sum, b) => sum + b.total, 0) + bookings.active.reduce((sum, b) => sum + b.total, 0),
  };

  const handleCancelBooking = (bookingId: string) => {
    setCancelBookingId(bookingId);
  };

  const confirmCancelBooking = (reason: string, details: string) => {
    if (!cancelBookingId) return;

    setBookings(prev => {
      const bookingToCancel = prev.active.find(b => b.id === cancelBookingId);
      
      if (!bookingToCancel) return prev;
      
      // Calculate refund
      const bookingDate = new Date(bookingToCancel.bookingDate);
      const cancellationDate = new Date();
      const { refundAmount, refundPercentage, reason: refundReason } = calculateRefund(
        bookingToCancel.total,
        bookingDate,
        cancellationDate
      );
      
      // Update localStorage to mark room as available
      const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const bookingIndex = allBookings.findIndex((b: any) => b.id === cancelBookingId);
      if (bookingIndex !== -1) {
        allBookings[bookingIndex].status = "cancelled";
        allBookings[bookingIndex].cancellationReason = reason;
        allBookings[bookingIndex].cancellationDetails = details;
        allBookings[bookingIndex].refundAmount = refundAmount;
        allBookings[bookingIndex].refundPercentage = refundPercentage;
        localStorage.setItem("bookings", JSON.stringify(allBookings));
      }
      
      return {
        ...prev,
        active: prev.active.filter(b => b.id !== cancelBookingId),
        cancelled: [
          ...prev.cancelled,
          { 
            ...bookingToCancel, 
            status: "cancelled" as const,
            cancellationReason: reason,
            cancellationDetails: details,
            refundAmount,
            refundPercentage
          }
        ]
      };
    });

    // Get refund info for toast
    const bookingToCancel = bookings.active.find(b => b.id === cancelBookingId);
    if (bookingToCancel) {
      const bookingDate = new Date(bookingToCancel.bookingDate);
      const cancellationDate = new Date();
      const { refundAmount, refundPercentage } = calculateRefund(
        bookingToCancel.total,
        bookingDate,
        cancellationDate
      );
      
      toast({
        title: "Booking Cancelled",
        description: `Your booking has been cancelled. The room is now available again. You will receive ${refundPercentage}% refund (₹${refundAmount.toLocaleString()}) within 5-7 business days.`,
      });
    }

    setCancelBookingId(null);
  };

  const handleTrackBooking = () => {
    if (!trackingId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a booking ID",
        variant: "destructive",
      });
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const found = allBookings.find((b: any) => b.id === trackingId);

    if (found) {
      setTrackedBooking(found);
      toast({
        title: "Booking Found",
        description: "Your booking details are displayed below",
      });
    } else {
      toast({
        title: "Booking Not Found",
        description: "No booking found with this ID. Try searching for an actual booking ID from your bookings.",
        variant: "destructive",
      });
      setTrackedBooking(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-muted";
    }
  };

  const renderBookingCard = (booking: any) => (
    <div key={booking.id} className="animate-fade-in">
      <Card className="p-6 hover-lift">
        <div className="flex items-start gap-4">
          <img
            src={booking.image}
            alt={booking.hotelName}
            className="w-32 h-32 rounded-lg object-cover hover-scale"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">
                  {booking.hotelName}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {booking.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Rating rating={4.5} size="sm" />
                  </div>
                </div>
              </div>
              <Badge
                variant={
                  booking.status === "active"
                    ? "default"
                    : booking.status === "completed"
                    ? "secondary"
                    : "destructive"
                }
                className="capitalize"
              >
                {booking.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                {booking.status === "completed" && <Clock className="w-3 h-3 mr-1" />}
                {booking.status === "cancelled" && <XCircle className="w-3 h-3 mr-1" />}
                {booking.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Check-in: {booking.checkIn}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Check-out: {booking.checkOut}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {booking.guests} Guests
                </span>
              </div>
              <div className="text-muted-foreground">
                {booking.roomType}
              </div>
              <div className="col-span-2 flex items-center gap-2 text-xs text-muted-foreground border-t pt-2">
                <Calendar className="w-3 h-3" />
                <span>Booked on: {new Date(booking.bookingDate).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div>
                <div className="text-lg font-bold text-primary">
                  Total: ₹{booking.total.toLocaleString()}
                </div>
                {booking.status === "cancelled" && booking.refundAmount !== undefined && (
                  <div className="text-sm text-green-600 font-medium mt-1">
                    Refund: ₹{booking.refundAmount.toLocaleString()} ({booking.refundPercentage}%)
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/receipt/${booking.id}`)}
                >
                  <Receipt className="w-4 h-4 mr-1" />
                  View Receipt
                </Button>
                {booking.status === "completed" && (
                  <Button 
                    variant="accent" 
                    size="sm"
                    onClick={() => navigate(`/leave-review/${booking.id}`)}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Leave Review
                  </Button>
                )}
                {booking.status === "active" && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage and track all your hotel reservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 text-center hover-lift bg-gradient-to-br from-primary/5 to-accent/5 border-accent/20">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.totalBookings}
            </div>
            <p className="text-sm text-muted-foreground">Total Bookings</p>
          </Card>

          <Card className="p-6 text-center hover-lift bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.activeBookings}
            </div>
            <p className="text-sm text-muted-foreground">Active Bookings</p>
          </Card>

          <Card className="p-6 text-center hover-lift bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.completed}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </Card>

          <Card className="p-6 text-center hover-lift bg-gradient-to-br from-accent/10 to-accent/20 border-accent/30">
            <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-3xl font-bold text-accent mb-1">
              ₹{stats.totalSpent.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </Card>
        </div>

        {/* Bookings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-5 mb-6">
            <TabsTrigger value="active">
              Active ({bookings.active.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-1" />
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({bookings.past.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({bookings.cancelled.length})
            </TabsTrigger>
            <TabsTrigger value="track">
              Track Booking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {bookings.active.length > 0 ? (
              bookings.active.map(renderBookingCard)
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Bookings</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any bookings scheduled at the moment. Start exploring our available hotels!
                </p>
                <Button onClick={() => navigate("/")}>Explore Hotels</Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    id={hotel.id}
                    name={hotel.name}
                    location={hotel.location}
                    image={hotel.image}
                    rating={hotel.rating}
                    price={hotel.price}
                    amenities={hotel.amenities}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Favorite Hotels</h3>
                <p className="text-muted-foreground mb-4">
                  Save hotels you love for quick access later
                </p>
                <Button onClick={() => navigate("/")}>Explore Hotels</Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {bookings.past.length > 0 ? (
              bookings.past.map(renderBookingCard)
            ) : (
              <Card className="p-12 text-center">
                <Clock className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Past Bookings</h3>
                <p className="text-muted-foreground">
                  You don't have any completed bookings yet
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {bookings.cancelled.length > 0 ? (
              bookings.cancelled.map(renderBookingCard)
            ) : (
              <Card className="p-12 text-center">
                <XCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Cancelled Bookings</h3>
                <p className="text-muted-foreground">
                  You don't have any cancelled bookings
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="track" className="space-y-4">
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Track Your Booking</h3>
                <p className="text-muted-foreground">
                  Enter your booking ID to check your reservation status
                </p>
              </div>
              
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Enter Booking ID (e.g., BK-123456)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrackBooking()}
                  className="flex-1"
                />
                <Button onClick={handleTrackBooking} variant="accent">
                  <Search className="h-4 w-4 mr-2" />
                  Track
                </Button>
              </div>

              {trackedBooking && (
                <Card className="border-accent/30">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(trackedBooking.status)}
                        <h4 className="text-xl font-bold">Booking Details</h4>
                      </div>
                      <Badge className={getStatusColor(trackedBooking.status)}>
                        {trackedBooking.status?.toUpperCase() || "CONFIRMED"}
                      </Badge>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={trackedBooking.hotelImage || hotelImage}
                            alt={trackedBooking.hotelName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2">{trackedBooking.hotelName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <MapPin className="h-4 w-4" />
                            {trackedBooking.hotelLocation || trackedBooking.location || "India"}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">Booking ID</p>
                              <p className="font-semibold">{trackedBooking.bookingId || trackedBooking.id}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Room Type</p>
                              <p className="font-semibold">{trackedBooking.roomType}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Check-in
                          </p>
                          <p className="font-semibold">
                            {new Date(trackedBooking.checkIn).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Check-out
                          </p>
                          <p className="font-semibold">
                            {new Date(trackedBooking.checkOut).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Guests
                          </p>
                          <p className="font-semibold">{trackedBooking.guests || trackedBooking.guestName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                          <p className="font-semibold text-accent text-lg">
                            ₹{parseFloat(trackedBooking.totalAmount).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-3 font-medium">Booking Timeline</p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Booking Confirmed</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(trackedBooking.bookingDate).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          {trackedBooking.paymentMethod && (
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Payment Received</p>
                                <p className="text-xs text-muted-foreground">
                                  via {trackedBooking.paymentMethod}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Check-in Date</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(trackedBooking.checkIn).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t">
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/receipt/${trackedBooking.id || trackedBooking.bookingId}`)}
                          className="flex-1"
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Cancel Booking Dialog */}
      <CancelBookingDialog
        open={!!cancelBookingId}
        onOpenChange={() => setCancelBookingId(null)}
        onConfirm={confirmCancelBooking}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
