import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Calendar, 
  Lock, 
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Banknote,
  UserCheck,
  Users,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRefundPolicyText } from "@/utils/refundPolicy";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const hotelName = searchParams.get("hotel") || "Luxury Hotel";
  const roomType = searchParams.get("room") || "Deluxe Room";
  const checkIn = searchParams.get("checkIn") || "2024-01-15";
  const checkOut = searchParams.get("checkOut") || "2024-01-18";
  const guests = searchParams.get("guests") || "2";
  const totalPrice = searchParams.get("price") || "15000";

  const [selectedRoomType, setSelectedRoomType] = useState(roomType);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [saveCard, setSaveCard] = useState(false);
  const [bookingFor, setBookingFor] = useState("self");
  const [formFilled, setFormFilled] = useState(false);
  const [refundPolicyAccepted, setRefundPolicyAccepted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [numberOfMembers, setNumberOfMembers] = useState("1");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);
    
    // Check if user is new (just registered)
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const currentUserData = users.find((u: any) => u.email === user.email);
    const userBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
      .filter((b: any) => b.user?.email === user.email);
    
    // Auto-apply WELCOME50 for new users
    if (currentUserData && userBookings.length === 0) {
      setPromoCode("WELCOME50");
      setDiscount(50);
      setPromoApplied(true);
    }
    
    // Pre-fill form if booking for self
    if (bookingFor === "self" && user.email) {
      setTimeout(() => {
        const firstName = document.getElementById("firstName") as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        if (firstName && user.name) {
          const nameParts = user.name.split(" ");
          firstName.value = nameParts[0] || "";
          const lastName = document.getElementById("lastName") as HTMLInputElement;
          if (lastName) lastName.value = nameParts.slice(1).join(" ") || "";
        }
        if (email) email.value = user.email;
        checkFormValidity();
      }, 100);
    }
  }, [bookingFor]);

  const checkFormValidity = () => {
    const firstName = (document.getElementById("firstName") as HTMLInputElement)?.value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement)?.value;
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const phone = (document.getElementById("phone") as HTMLInputElement)?.value;
    const address = (document.getElementById("address") as HTMLInputElement)?.value;
    const city = (document.getElementById("city") as HTMLInputElement)?.value;
    const pincode = (document.getElementById("pincode") as HTMLInputElement)?.value;
    
    const isValid = firstName && lastName && email && phone && address && city && pincode && numberOfMembers;
    setFormFilled(!!isValid);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formFilled) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding to payment.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate refund policy acceptance
    if (!refundPolicyAccepted) {
      toast({
        title: "Accept Refund Policy",
        description: "Please accept the refund policy to proceed with payment.",
        variant: "destructive",
      });
      return;
    }
    
    // Get booking details
    const pendingBooking = JSON.parse(localStorage.getItem("pendingBooking") || "{}");
    
    // Generate booking ID
    const bookingId = `BK${Date.now()}`;
    const bookingDate = new Date().toISOString();
    
    const finalAmount = parseFloat(totalPrice) * 1.18 - discount;
    
    // Create booking record
    const booking = {
      id: bookingId,
      ...pendingBooking,
      roomType: selectedRoomType,
      user: currentUser,
      userId: currentUser?.email,
      bookingDate,
      status: "confirmed",
      paymentMethod,
      bookingFor,
      numberOfMembers: numberOfMembers,
      guestDetails: {
        firstName: (document.getElementById("firstName") as HTMLInputElement)?.value,
        lastName: (document.getElementById("lastName") as HTMLInputElement)?.value,
        email: (document.getElementById("email") as HTMLInputElement)?.value,
        phone: (document.getElementById("phone") as HTMLInputElement)?.value,
        address: (document.getElementById("address") as HTMLInputElement)?.value,
        city: (document.getElementById("city") as HTMLInputElement)?.value,
        pincode: (document.getElementById("pincode") as HTMLInputElement)?.value,
      },
      specialRequests: (document.getElementById("specialRequests") as HTMLTextAreaElement)?.value,
      totalAmount: finalAmount.toFixed(0),
      promoCode: promoApplied ? promoCode : null,
      discount: discount,
    };
    
    // Save booking
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    localStorage.removeItem("pendingBooking");
    
    // Navigate to receipt immediately (payment successful)
    navigate(`/receipt/${bookingId}`);
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "WELCOME50") {
      setDiscount(50);
      setPromoApplied(true);
      toast({
        title: "Promo Code Applied!",
        description: "You've saved ₹50 on your booking",
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "The promo code you entered is not valid",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 mb-8">
        <div className="container mx-auto px-4 text-center">
          <Button
            variant="ghost"
            className="text-primary-foreground hover:bg-white/10 mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold mb-2 text-primary-foreground">Complete Your Booking</h1>
          <p className="text-primary-foreground/80">Just a few more steps to confirm your stay</p>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 pb-12">
        {/* Refund Policy Alert */}
        <Alert className="mb-6 border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Cancellation Policy:</strong> Same day cancellation: 100% refund • Within 24hrs: 90% • 
            Within 3 days: 75% • Within 7 days: 50% • Within 14 days: 25%
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Forms */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            {/* Booking For */}
            <Card className="shadow-lg hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-primary" />
                  <span>Booking For</span>
                </CardTitle>
                <CardDescription>Who is this booking for?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={bookingFor} onValueChange={setBookingFor} className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
                    <RadioGroupItem value="self" id="self" />
                    <Label htmlFor="self" className="flex-1 cursor-pointer flex items-center space-x-2">
                      <UserCheck className="h-5 w-5" />
                      <span>Myself</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="flex-1 cursor-pointer flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Someone Else</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Room Type Selection */}
            <Card className="shadow-lg hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-6 w-6 text-primary" />
                  <span>Select Room Type</span>
                </CardTitle>
                <CardDescription>Choose your preferred room type</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Deluxe Room">Deluxe Room</SelectItem>
                    <SelectItem value="Executive Suite">Executive Suite</SelectItem>
                    <SelectItem value="Premium Suite">Premium Suite</SelectItem>
                    <SelectItem value="Presidential Suite">Presidential Suite</SelectItem>
                    <SelectItem value="Standard Room">Standard Room</SelectItem>
                    <SelectItem value="Family Suite">Family Suite</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Guest Details */}
            <Card className="shadow-lg hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-primary" />
                  <span>Guest Details</span>
                </CardTitle>
                <CardDescription>Enter the primary guest information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      required 
                      onChange={checkFormValidity}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      required 
                      onChange={checkFormValidity}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john.doe@example.com" 
                      className="pl-10" 
                      required 
                      onChange={checkFormValidity}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      className="pl-10" 
                      required 
                      onChange={checkFormValidity}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfMembers">Number of Members <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="numberOfMembers" 
                      type="number" 
                      min="1"
                      placeholder="e.g., 2" 
                      className="pl-10" 
                      value={numberOfMembers}
                      onChange={(e) => {
                        setNumberOfMembers(e.target.value);
                        checkFormValidity();
                      }}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="address" 
                      placeholder="Street address" 
                      className="pl-10" 
                      required 
                      onChange={checkFormValidity}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                    <Input 
                      id="city" 
                      placeholder="Mumbai" 
                      required 
                      onChange={checkFormValidity}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code <span className="text-destructive">*</span></Label>
                    <Input 
                      id="pincode" 
                      placeholder="400001" 
                      required 
                      onChange={checkFormValidity}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method - Only show if form is filled */}
            {formFilled && (
              <Card className="shadow-lg hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <span>Payment Method</span>
                  </CardTitle>
                  <CardDescription>Select your preferred payment option</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment} className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Credit / Debit Card</span>
                      </Label>
                      <div className="flex space-x-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1 cursor-pointer flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <span>UPI Payment</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex-1 cursor-pointer flex items-center space-x-2">
                        <Banknote className="h-5 w-5" />
                        <span>Net Banking</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex-1 cursor-pointer flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Digital Wallet</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 pt-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="pl-10"
                            maxLength={19}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input id="cardName" placeholder="JOHN DOE" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input id="expiry" placeholder="MM/YY" className="pl-10" maxLength={5} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input id="cvv" type="password" placeholder="123" className="pl-10" maxLength={3} required />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="saveCard" checked={saveCard} onCheckedChange={(checked) => setSaveCard(checked as boolean)} />
                        <label htmlFor="saveCard" className="text-sm text-muted-foreground">
                          Save this card for future bookings
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-4 pt-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input id="upiId" placeholder="yourname@upi" required />
                      </div>
                    </div>
                  )}

                  {/* Refund Policy Agreement */}
                  <div className="pt-6 border-t space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="refundPolicy" 
                        checked={refundPolicyAccepted} 
                        onCheckedChange={(checked) => setRefundPolicyAccepted(checked as boolean)} 
                      />
                      <div className="flex-1">
                        <label htmlFor="refundPolicy" className="text-sm font-medium cursor-pointer">
                          I accept the refund and cancellation policy
                        </label>
                        <div className="mt-2 text-xs text-muted-foreground bg-accent/10 p-3 rounded-md">
                          <p className="font-semibold mb-2">Cancellation & Refund Policy:</p>
                          <ul className="space-y-1">
                            <li>• Same day cancellation: 100% refund</li>
                            <li>• Within 24 hours: 90% refund</li>
                            <li>• Within 3 days: 75% refund</li>
                            <li>• Within 7 days: 50% refund</li>
                            <li>• Within 14 days: 25% refund</li>
                            <li>• After 14 days: No refund</li>
                          </ul>
                          <p className="mt-2">Refunds processed within 5-7 business days.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Special Requests */}
            <Card className="shadow-lg hover-lift">
              <CardHeader>
                <CardTitle>Special Requests (Optional)</CardTitle>
                <CardDescription>Let us know if you have any special requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="specialRequests"
                  className="min-h-[100px]"
                  placeholder="e.g., Early check-in, specific floor preference, dietary requirements..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl sticky top-24 animate-scale-in hover-lift">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="text-primary-foreground">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{hotelName}</h3>
                  <p className="text-sm text-muted-foreground">{roomType}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-medium text-foreground">{new Date(checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-medium text-foreground">{new Date(checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-medium text-foreground">{guests} Adults</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nights</span>
                    <span className="font-medium text-foreground">
                      {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Promo Code Section */}
                <div className="space-y-2">
                  <Label className="text-foreground">Promo Code</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      disabled={promoApplied}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                      disabled={promoApplied}
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-green-600">✓ Promo code applied successfully!</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Room charges</span>
                    <span className="text-foreground">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="text-foreground">₹{(parseFloat(totalPrice) * 0.18).toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({promoCode})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{(parseFloat(totalPrice) * 1.18 - discount).toFixed(0)}
                  </span>
                </div>

                <div className="bg-accent/20 p-3 rounded-lg flex items-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Your booking is protected by SevaStay's secure payment system. 
                    Free cancellation up to 24 hours before check-in.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-3">
                {formFilled ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePayment}
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    Pay ₹{(parseFloat(totalPrice) * 1.18 - discount).toFixed(0)}
                  </Button>
                ) : (
                  <div className="w-full p-4 bg-accent/20 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      Please fill in all required guest details to proceed with payment
                    </p>
                  </div>
                )}
                <p className="text-xs text-center text-muted-foreground">
                  By completing this booking, you agree to our Terms & Conditions
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

