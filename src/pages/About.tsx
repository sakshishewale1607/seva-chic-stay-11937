import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import { 
  Award, 
  Heart, 
  Shield, 
  Star, 
  Users, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageSquare 
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getRefundPolicyText } from "@/utils/refundPolicy";

const About = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const services = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Handpicked hotels with verified quality standards and exceptional service.",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your data and payments are protected with bank-level security.",
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Our dedicated team is always available to assist you with any queries.",
    },
    {
      icon: Globe,
      title: "Pan-India Coverage",
      description: "From beaches to mountains, cities to heritage sites - we cover it all.",
    },
    {
      icon: Heart,
      title: "Best Price Guarantee",
      description: "Get the most competitive rates with our best price guarantee.",
    },
    {
      icon: Star,
      title: "Curated Experiences",
      description: "Personalized recommendations based on your preferences and travel style.",
    },
  ];

  const faqs = [
    {
      question: "How do I book a hotel?",
      answer: "Simply search for your destination, select your dates, choose a hotel, and complete the booking with your details and payment information. You'll receive instant confirmation via email."
    },
    {
      question: "What is your cancellation policy?",
      answer: getRefundPolicyText()
    },
    {
      question: "How can I modify my booking?",
      answer: "To modify your booking, please contact our customer support team at support@sevastay.com or call +91 1800-123-4567. Modifications are subject to availability and may incur additional charges."
    },
    {
      question: "Are there any hidden charges?",
      answer: "No! We believe in complete transparency. The price you see includes all taxes and fees. The only additional charges would be for optional services you choose to add."
    },
    {
      question: "How do I get my booking receipt?",
      answer: "Your booking receipt is automatically sent to your registered email. You can also download it anytime from the 'My Bookings' section after logging in."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Credit/Debit Cards (Visa, Mastercard), UPI, Net Banking, and Digital Wallets for your convenience."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-accent">About SevaStay</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your trusted partner in discovering exceptional stays across India
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Our Story */}
        <Card className="p-8 mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Founded with a vision to revolutionize hotel booking in India, SevaStay brings together
              the finest accommodations under one roof. We believe that every journey deserves a
              perfect stay, and we're committed to making that happen.
            </p>
            <p>
              From luxurious beach resorts to cozy mountain retreats, from heritage palaces to modern
              business hotels - we curate experiences that match your unique travel style. Our platform
              connects travelers with verified properties that meet our stringent quality standards.
            </p>
            <p>
              With thousands of satisfied customers and hundreds of partner hotels across India, we've
              built a reputation for reliability, transparency, and exceptional service. Your comfort
              and satisfaction are at the heart of everything we do.
            </p>
          </div>
        </Card>

        {/* Our Services */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Why Choose SevaStay?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover-lift">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <Card className="p-8 mb-12 gradient-primary text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">500+</div>
              <div className="text-white/80">Partner Hotels</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">50K+</div>
              <div className="text-white/80">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">100+</div>
              <div className="text-white/80">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">4.8/5</div>
              <div className="text-white/80">Average Rating</div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
              <MessageSquare className="h-8 w-8" />
              Get In Touch
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground">+91 1800-123-4567</p>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">support@sevastay.com</p>
                  <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Office</h3>
                  <p className="text-muted-foreground">123 Business Park, Mumbai, Maharashtra 400001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Business Hours</h3>
                  <p className="text-muted-foreground">24/7 Online Support</p>
                  <p className="text-sm text-muted-foreground">Office: Mon-Sat, 9 AM - 6 PM IST</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Form */}
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="What is this regarding?"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="How can we help you?"
                  className="min-h-[120px]"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="p-8 mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground whitespace-pre-line">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
