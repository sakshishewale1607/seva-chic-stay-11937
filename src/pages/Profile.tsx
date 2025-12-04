import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, CreditCard, Settings, Bell, Globe, Lock, Camera, Calendar } from "lucide-react";
import Footer from "@/components/Footer";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [mobileNotif, setMobileNotif] = useState(true);
  const [language, setLanguage] = useState("english");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);
    setProfilePhoto(user.profilePhoto || localStorage.getItem("profilePhoto") || "");
    
    const savedSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    if (savedSettings.language) setLanguage(savedSettings.language);
  }, [navigate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        setProfilePhoto(photoUrl);
        localStorage.setItem("profilePhoto", photoUrl);
        
        const updatedUser = { ...currentUser, profilePhoto: photoUrl };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        
        const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem("registeredUsers", JSON.stringify(users));
        }
        
        toast({
          title: "Photo Updated",
          description: "Profile photo has been updated successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      
      const updatedUser = { ...currentUser, password: newPassword };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
      });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSettingsSave = () => {
    const settings = {
      emailNotif,
      mobileNotif,
      language,
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated",
    });
  };

  if (!currentUser) return null;

  const totalBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    .filter((b: any) => b.user?.email === currentUser.email).length;

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">My Profile</h1>
          <p className="text-white/80 mt-2">Manage your account and preferences</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profilePhoto} />
                    <AvatarFallback className="text-3xl">{currentUser?.fullName?.[0] || "U"}</AvatarFallback>
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
                
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    {currentUser?.title} {currentUser?.fullName}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{currentUser?.email}</p>
                </div>

                <Separator />

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-accent" />
                    <span>{currentUser?.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>{currentUser?.address || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>{totalBookings} Total Bookings</span>
                  </div>
                </div>

                <Button className="w-full" onClick={() => navigate("/my-bookings")}>
                  View My Bookings
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Content - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">
                  <User className="h-4 w-4 mr-2" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">Personal Information</CardTitle>
                    <CardDescription>Your basic account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={currentUser?.title || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={currentUser?.fullName || ""} disabled />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input value={currentUser?.email || ""} disabled className="pl-10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input value={currentUser?.phone || ""} disabled className="pl-10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input value={currentUser?.address || "Not provided"} disabled className="pl-10" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Aadhaar Number</Label>
                        <Input value={currentUser?.aadhaar || "Not provided"} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>PAN Card</Label>
                        <Input value={currentUser?.pan || "Not provided"} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payment Tab */}
              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">Payment Information</CardTitle>
                    <CardDescription>Manage your payment methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">No saved payment methods yet.</p>
                    <p className="text-sm text-muted-foreground">
                      Payment methods will be saved when you complete a booking and choose to save your card details.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <div className="space-y-6">
                  {/* Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                      </CardTitle>
                      <CardDescription>Manage your notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
                        </div>
                        <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Mobile Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive SMS alerts for bookings</p>
                        </div>
                        <Switch checked={mobileNotif} onCheckedChange={setMobileNotif} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Language Preference */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Language Preference
                      </CardTitle>
                      <CardDescription>Choose your preferred language</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                          <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  {/* Privacy & Security */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Privacy & Security
                      </CardTitle>
                      <CardDescription>Change your password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <Button onClick={handlePasswordChange}>Change Password</Button>
                    </CardContent>
                  </Card>

                  {/* Save Settings Button */}
                  <Button className="w-full" size="lg" onClick={handleSettingsSave}>
                    Save All Settings
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
