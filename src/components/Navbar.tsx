import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, User, LogOut, UserCircle, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/sevastay-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      setCurrentUser(user);
      setProfilePhoto(localStorage.getItem("profilePhoto") || "");
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("profilePhoto");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setProfileOpen(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        setProfilePhoto(photoUrl);
        localStorage.setItem("profilePhoto", photoUrl);
        toast({
          title: "Photo Updated",
          description: "Profile photo has been updated successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
  
    <img 
      src={logoImage} 
      alt="Logo" 
      className="h-30 w-32 object-contain" 
    />
 
</Link>


          
          {/* Navigation Links - Moved to right */}
          <div className="hidden md:flex items-center gap-6 ml-auto mr-4">
            <Link 
              to="/" 
              className={`hover:text-accent transition-colors ${isActive('/') ? 'text-accent font-semibold' : ''}`}
            >
              Home
            </Link>
            <Link to="/">
             <span className="text-primary-foreground hover:text-accent transition-colors ">Offers</span>
             </Link>
            {isLoggedIn && (
              <Link 
                to="/my-bookings" 
                className={`hover:text-accent transition-colors ${isActive('/my-bookings') ? 'text-accent font-semibold' : ''}`}
              >
                My Bookings
              </Link>
            )}
            <Link 
              to="/about" 
              className={`hover:text-accent transition-colors ${isActive('/about') ? 'text-accent font-semibold' : ''}`}
            >
              About
            </Link>
          </div>

          {/* User Account Section */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
                <SheetTrigger asChild>
                  <Button variant="accent" size="sm">
                    {profilePhoto ? (
                      <Avatar className="h-6 w-6 md:mr-2">
                        <AvatarImage src={profilePhoto} />
                        <AvatarFallback>{currentUser?.fullName?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserCircle className="h-4 w-4 md:mr-2" />
                    )}
                    <span className="hidden md:inline">{currentUser?.fullName || "Profile"}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Profile Information</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={profilePhoto} />
                          <AvatarFallback className="text-2xl">{currentUser?.fullName?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-accent text-white p-2 rounded-full cursor-pointer hover:bg-accent/80">
                          <Camera className="h-4 w-4" />
                          <input 
                            id="photo-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handlePhotoUpload}
                          />
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground">Click camera icon to upload photo</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input value={`${currentUser?.title || ""} ${currentUser?.fullName || ""}`} disabled />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={currentUser?.email || ""} disabled />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input value={currentUser?.phone || "Not provided"} disabled />
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/profile");
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/my-bookings");
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        My Bookings
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Link to="/login">
                <Button variant="accent" size="sm">
                  <User className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
