import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/sevastay-logo.png";

const Footer = () => {
  const { toast } = useToast();
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);

  const handlePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Property Listing Submitted",
      description: "Thank you! Our team will review your property details and contact you soon.",
    });
    setPropertyDialogOpen(false);
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
         {/* Brand Section */}
<div className="md:col-span-2 space-y-4">
  <div className="mb-4">
    <img 
      src={logoImage} 
      alt="Logo" 
      className="h-40 w-auto object-contain"
    />
  </div>

  <p className="text-primary-foreground/80">
    Your trusted partner for luxury hotel bookings across India
  </p>
</div>


          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <button onClick={() => setAboutDialogOpen(true)} className="hover:text-accent transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setContactDialogOpen(true)} className="hover:text-accent transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => setPropertyDialogOpen(true)} className="hover:text-accent transition-colors font-semibold">
                  List Your Property
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-accent">Support</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <button onClick={() => setHelpDialogOpen(true)} className="hover:text-accent transition-colors">
                  Help Center
                </button>
              </li>
              <li>
                <button onClick={() => setTermsDialogOpen(true)} className="hover:text-accent transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => setPrivacyDialogOpen(true)} className="hover:text-accent transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-bold mb-4 text-accent">Contact Us</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Email: info@sevastay.com</li>
              <li>Phone: +91 12345 67890</li>
              <li>Address: Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2025 SevaStay. All rights reserved.</p>
        </div>
      </div>

      {/* List Your Property Dialog */}
      <Dialog open={propertyDialogOpen} onOpenChange={setPropertyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>List Your Property</DialogTitle>
            <DialogDescription>
              Join SevaStay and reach millions of travelers. Fill in your property details below and our team will get in touch.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePropertySubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyName">Property Name *</Label>
                <Input id="propertyName" required />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Input id="propertyType" placeholder="Hotel, Resort, Villa..." required />
              </div>
            </div>
            <div>
              <Label htmlFor="propertyAddress">Property Address *</Label>
              <Input id="propertyAddress" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownerName">Your Name *</Label>
                <Input id="ownerName" required />
              </div>
              <div>
                <Label htmlFor="ownerPhone">Phone Number *</Label>
                <Input id="ownerPhone" type="tel" required />
              </div>
            </div>
            <div>
              <Label htmlFor="ownerEmail">Email *</Label>
              <Input id="ownerEmail" type="email" required />
            </div>
            <div>
              <Label htmlFor="propertyDescription">Property Description</Label>
              <Textarea id="propertyDescription" rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setPropertyDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* About Us Dialog */}
      <Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About SevaStay</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>SevaStay is India's leading hotel booking platform, connecting travelers with the finest accommodations across the country.</p>
            <p>Founded in 2020, we've helped millions of guests find their perfect stay, from luxury resorts to budget-friendly hotels.</p>
            <p>Our mission is to make hotel booking simple, transparent, and rewarding for every traveler.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p>info@sevastay.com</p>
              <p className="text-sm text-muted-foreground">For general inquiries</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Phone</h4>
              <p>+91 12345 67890</p>
              <p className="text-sm text-muted-foreground">Mon-Sat, 9 AM - 6 PM IST</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Office Address</h4>
              <p>SevaStay Headquarters</p>
              <p>123 Hotel Plaza, Mumbai, Maharashtra 400001</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Center Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help Center</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Frequently Asked Questions</h4>
              <ul className="space-y-2">
                <li><strong>How do I book a hotel?</strong> - Search for your destination, select dates, and choose your preferred hotel.</li>
                <li><strong>Can I cancel my booking?</strong> - Yes, you can cancel from the "My Bookings" page. Refund terms apply.</li>
                <li><strong>How do I modify my booking?</strong> - Contact our support team or the hotel directly.</li>
                <li><strong>Is my payment secure?</strong> - Yes, we use industry-standard encryption for all transactions.</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms & Conditions Dialog */}
      <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <section>
              <h4 className="font-semibold mb-2">1. Booking Terms</h4>
              <p>All bookings are subject to availability and confirmation by the hotel. Prices are subject to change without notice.</p>
            </section>
            <section>
              <h4 className="font-semibold mb-2">2. Payment</h4>
              <p>Payment must be made at the time of booking. We accept credit cards, debit cards, and UPI.</p>
            </section>
            <section>
              <h4 className="font-semibold mb-2">3. Cancellation & Refund Policy</h4>
              <p className="mb-3">We understand that plans can change. Here's our refund policy based on when you cancel from the booking date:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Same day cancellation:</strong> 100% refund</li>
                <li><strong>Within 24 hours:</strong> 90% refund</li>
                <li><strong>Within 3 days:</strong> 75% refund</li>
                <li><strong>Within 7 days:</strong> 50% refund</li>
                <li><strong>Within 14 days:</strong> 25% refund</li>
                <li><strong>After 14 days:</strong> No refund</li>
              </ul>
              <p className="mt-3">Refunds will be processed within 5-7 business days to the original payment method. Convenience fees and processing charges are non-refundable.</p>
            </section>
            <section>
              <h4 className="font-semibold mb-2">4. User Conduct</h4>
              <p>Users must provide accurate information and comply with hotel policies during their stay.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <section>
              <h4 className="font-semibold mb-2">Information We Collect</h4>
              <p>We collect personal information necessary for booking, including name, email, phone number, and payment details.</p>
            </section>
            <section>
              <h4 className="font-semibold mb-2">How We Use Your Information</h4>
              <p>Your information is used to process bookings, communicate with you, and improve our services.</p>
            </section>
            <section>
              <h4 className="font-semibold mb-2">Data Security</h4>
              <p>We implement industry-standard security measures to protect your personal information.</p>
            </section>
            <section>
              <h4 className="font-semibold mb-2">Third-Party Sharing</h4>
              <p>We only share your information with hotels for booking purposes and trusted service providers.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;