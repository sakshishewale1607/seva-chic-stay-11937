import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, ArrowLeft, CheckCircle } from "lucide-react";

export default function Receipt() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // Get booking data from localStorage
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const bookingData = bookings.find((b: any) => b.id === bookingId);
  
  if (!bookingData) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Booking Not Found</h2>
          <p className="text-muted-foreground mb-4">The booking receipt you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  const booking = {
    id: bookingData.id,
    hotelName: bookingData.hotelName,
    roomType: bookingData.roomType,
    checkIn: bookingData.checkIn,
    checkOut: bookingData.checkOut,
    guests: bookingData.guests,
    nights: Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
    roomPrice: parseFloat(bookingData.price || bookingData.totalAmount),
    taxesAndFees: Math.round(parseFloat(bookingData.price || bookingData.totalAmount) * 0.18),
    total: bookingData.totalAmount,
    paymentMethod: bookingData.paymentMethod || "Credit Card",
    paymentDate: new Date(bookingData.bookingDate).toLocaleDateString('en-IN'),
    transactionId: "TXN" + bookingData.id.replace("BK", ""),
    guestName: `${bookingData.guestDetails?.firstName} ${bookingData.guestDetails?.lastName}`,
    guestEmail: bookingData.guestDetails?.email,
    guestPhone: bookingData.guestDetails?.phone
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In real app, this would generate and download PDF
    alert("Receipt downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 print:hidden">
        <div className="container mx-auto px-4 text-center">
          <Button
            variant="ghost"
            className="text-primary-foreground hover:bg-white/10 mb-4"
            onClick={() => navigate("/my-bookings")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
          <h1 className="text-3xl font-bold text-primary-foreground">Booking Receipt</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto p-8">
          {/* Success Banner */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Payment Successful!</h3>
              <p className="text-sm text-green-700">Your booking has been confirmed</p>
            </div>
          </div>

          {/* Receipt Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">SevaStay</h2>
            <p className="text-muted-foreground">Booking Confirmation Receipt</p>
            <p className="text-sm text-muted-foreground mt-1">
              Booking ID: <span className="font-mono font-semibold text-foreground">{booking.id}</span>
            </p>
          </div>

          <Separator className="mb-6" />

          {/* Hotel & Guest Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Hotel Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Hotel:</span> <span className="font-medium">{booking.hotelName}</span></p>
                <p><span className="text-muted-foreground">Room Type:</span> <span className="font-medium">{booking.roomType}</span></p>
                <p><span className="text-muted-foreground">Check-in:</span> <span className="font-medium">{booking.checkIn}</span></p>
                <p><span className="text-muted-foreground">Check-out:</span> <span className="font-medium">{booking.checkOut}</span></p>
                <p><span className="text-muted-foreground">Guests:</span> <span className="font-medium">{booking.guests}</span></p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Guest Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{booking.guestName}</span></p>
                <p><span className="text-muted-foreground">Email:</span> <span className="font-medium">{booking.guestEmail}</span></p>
                <p><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{booking.guestPhone}</span></p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Payment Details */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-primary">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Room Price ({booking.nights} nights × ₹{booking.roomPrice / booking.nights})</span>
                <span className="font-medium">₹{booking.roomPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span className="font-medium">₹{booking.taxesAndFees.toLocaleString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-primary">Total Amount Paid</span>
                <span className="text-primary">₹{booking.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Transaction Details */}
          <div className="bg-secondary/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2 text-primary">Transaction Details</h3>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <p><span className="text-muted-foreground">Payment Method:</span> <span className="font-medium">{booking.paymentMethod}</span></p>
              <p><span className="text-muted-foreground">Payment Date:</span> <span className="font-medium">{booking.paymentDate}</span></p>
              <p className="md:col-span-2"><span className="text-muted-foreground">Transaction ID:</span> <span className="font-mono font-medium">{booking.transactionId}</span></p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center print:hidden">
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Print Receipt
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
            <p>Thank you for choosing SevaStay!</p>
            <p className="mt-1">For any queries, contact us at support@sevastay.com or call +91 1800-123-4567</p>
          </div>
        </Card>
      </main>
    </div>
  );
}
