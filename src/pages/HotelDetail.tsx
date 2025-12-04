import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Footer from "@/components/Footer";
import { Rating } from "@/components/Rating";
import { ReviewCard } from "@/components/ReviewCard";
import { RoomDetailsDialog } from "@/components/RoomDetailsDialog";
import {
  MapPin,
  Wifi,
  Coffee,
  Waves,
  Dumbbell,
  Users,
  Bed,
  Wind,
  Calendar,
  Award,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import hotelImage from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedBookingRoom, setSelectedBookingRoom] = useState<any>(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const hotel = {
    id: id,
    name: "Grand Plaza Hotel",
    location: "Mumbai, Maharashtra",
    address: "123 Marine Drive, Mumbai, Maharashtra 400001",
    phone: "+91 22 1234 5678",
    email: "info@grandplaza.com",
    rating: 4.5,
    reviews: 328,
    coordinates: [72.8223, 19.0144], // Mumbai coordinates
    description:
      "Experience luxury at its finest with our premium accommodations. Grand Plaza Hotel offers world-class amenities, exceptional service, and breathtaking views. Whether you're here for business or leisure, we ensure a memorable stay.",
    amenities: [
      { icon: Wifi, name: "Free WiFi" },
      { icon: Coffee, name: "Restaurant" },
      { icon: Waves, name: "Swimming Pool" },
      { icon: Dumbbell, name: "Fitness Center" },
    ],
  };

  const rooms = [
    {
      id: 1,
      name: "Deluxe Suite",
      roomNumber: "301-305",
      price: 8000,
      beds: "1 King Bed",
      guests: 2,
      images: [hotelImage, hotel2, hotel3],
    },
    {
      id: 2,
      name: "Premium Room",
      roomNumber: "201-210",
      price: 6000,
      beds: "2 Queen Beds",
      guests: 4,
      images: [hotel2, hotelImage, hotel3],
    },
    {
      id: 3,
      name: "Executive Suite",
      roomNumber: "401-403",
      price: 10000,
      beds: "1 King Bed + Sofa",
      guests: 3,
      images: [hotel3, hotelImage, hotel2],
    },
  ];

  const reviews = [
    {
      name: "Priya Sharma",
      avatar: "",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely wonderful experience! The staff was incredibly courteous and the room was spotless.",
      roomType: "Deluxe Suite",
      verified: true,
      helpful: 24
    },
    {
      name: "Amit Patel",
      avatar: "",
      rating: 4,
      date: "1 month ago",
      comment: "Great location in the heart of the city. Easy access to all major attractions.",
      roomType: "Premium Room",
      verified: true,
      helpful: 18
    },
  ];

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY200ZWNxNmdyMDRjdjJrcXoyeXN4eTF1YSJ9.yFkSh8PtbrLF5FLbDNiSdg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: hotel.coordinates as [number, number],
      zoom: 14,
    });

    new mapboxgl.Marker({ color: '#c9a868' })
      .setLngLat(hotel.coordinates as [number, number])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<div class="p-2"><strong>${hotel.name}</strong><br/>${hotel.address}</div>`
        )
      )
      .addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  const handleBooking = (room: any) => {
    // Check if user is logged in (mock check - in real app, check authentication)
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (!isLoggedIn) {
      setSelectedBookingRoom(room);
      setShowLoginDialog(true);
    } else {
      proceedToCheckout(room);
    }
  };

  const proceedToCheckout = (room: any) => {
    const checkInDate = checkIn || new Date().toISOString().split('T')[0];
    const checkOutDate = checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
    
    // Check for duplicate bookings
    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const isDuplicate = existingBookings.some((booking: any) => 
      booking.hotelName === hotel.name &&
      booking.roomType === room.name &&
      booking.roomNumber === room.roomNumber &&
      booking.status !== "cancelled" &&
      (
        // Check if dates overlap
        (checkInDate >= booking.checkIn && checkInDate < booking.checkOut) ||
        (checkOutDate > booking.checkIn && checkOutDate <= booking.checkOut) ||
        (checkInDate <= booking.checkIn && checkOutDate >= booking.checkOut)
      )
    );
    
    if (isDuplicate) {
      toast({
        title: "Room Already Booked",
        description: "This room is already booked for the selected dates. Please choose different dates or another room.",
        variant: "destructive",
      });
      return;
    }
    
    // Store booking details for checkout
    const bookingDetails = {
      hotel: hotel.name,
      hotelName: hotel.name,
      room: room.name,
      roomType: room.name,
      roomNumber: room.roomNumber,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests,
      price: room.price,
      phone: hotel.phone,
      email: hotel.email,
      hotelAddress: hotel.address,
      hotelLocation: hotel.location,
    };
    
    localStorage.setItem("pendingBooking", JSON.stringify(bookingDetails));
    
    navigate(
      `/checkout?hotel=${hotel.name}&room=${room.name}&roomNumber=${room.roomNumber}&checkIn=${bookingDetails.checkIn}&checkOut=${bookingDetails.checkOut}&guests=${guests}&price=${room.price}&phone=${hotel.phone}&email=${hotel.email}`
    );
  };

  const handleLoginRedirect = () => {
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen bg-secondary/30">
        {/* Room Images Gallery */}
        <div className="relative h-[400px] bg-black">
          <img
            src={rooms[selectedRoomIndex].images[0]}
            alt={rooms[selectedRoomIndex].name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Gallery Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {rooms.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedRoomIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  selectedRoomIndex === index ? "bg-accent w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setSelectedRoomIndex((prev) => (prev > 0 ? prev - 1 : rooms.length - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setSelectedRoomIndex((prev) => (prev < rooms.length - 1 ? prev + 1 : 0))}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="container mx-auto px-4 -mt-24 relative z-10">
          <Card className="p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-lg">
                    <Rating rating={hotel.rating} size="sm" showNumber />
                    <span className="text-sm text-muted-foreground">
                      ({hotel.reviews} reviews)
                    </span>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Award className="w-3 h-3" />
                    Verified Property
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-accent" />
                    <span>{hotel.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent" />
                    <span>{hotel.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">{hotel.description}</p>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-primary">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover-lift"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <amenity.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-medium text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Map Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Location</h2>
            <p className="text-muted-foreground mb-4">{hotel.address}</p>
            <div ref={mapContainer} className="h-[400px] rounded-lg" />
          </Card>

          {/* Rooms and Booking */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Available Rooms */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-primary">Available Rooms</h2>
              {rooms.map((room) => (
                <Card key={room.id} className="p-6 hover-lift">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        className="w-40 h-32 rounded-lg object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-accent">
                        Room {room.roomNumber}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                      <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          {room.beds}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {room.guests} Guests
                        </div>
                        <div className="flex items-center gap-1">
                          <Wifi className="w-4 h-4" />
                          Free WiFi
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="w-4 h-4" />
                          AC
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            ₹{room.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per night
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSelectedRoom(room);
                              setShowRoomDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button onClick={() => handleBooking(room)}>
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4 text-primary">Book Your Stay</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="checkIn">Check-in Date</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkOut">Check-out Date</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guests">Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Separator />
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => handleBooking(rooms[0])}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Reviews Section */}
          <Card className="p-8 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Guest Reviews</h2>
              {isLoggedIn && (
                <Button onClick={() => navigate("/leave-review/mock-booking-id")}>
                  Leave a Review
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <ReviewCard key={index} {...review} />
              ))}
            </div>
          </Card>
        </div>

        {/* Login Dialog */}
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>
                Please login to continue with your booking. You'll be able to complete your reservation after signing in.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-4 mt-4">
              <Button variant="outline" onClick={() => setShowLoginDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleLoginRedirect} className="flex-1">
                Go to Login
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Room Details Dialog */}
        {selectedRoom && (
          <RoomDetailsDialog
            open={showRoomDetails}
            onOpenChange={setShowRoomDetails}
            room={selectedRoom}
          />
        )}

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
