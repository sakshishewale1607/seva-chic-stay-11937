import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, BedDouble } from "lucide-react";

interface EditBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any;
  onSave: (updatedBooking: any) => void;
}

export function EditBookingDialog({ open, onOpenChange, booking, onSave }: EditBookingDialogProps) {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: "",
  });

  // load booking data when dialog opens
  useEffect(() => {
    if (booking) {
      setFormData({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests || 1,
        roomType: booking.roomType || "",
      });
    }
  }, [booking]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.checkIn || !formData.checkOut || !formData.roomType) return;
    onSave({ ...booking, ...formData });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    if (booking) {
      setFormData({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests || 1,
        roomType: booking.roomType || "",
      });
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription>
            Modify your booking details below. You can adjust check-in dates, number of guests, and room type.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Check-In Date */}
          <div className="space-y-2">
            <Label htmlFor="checkIn" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" /> Check-In Date *
            </Label>
            <Input
              type="date"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
            />
          </div>

          {/* Check-Out Date */}
          <div className="space-y-2">
            <Label htmlFor="checkOut" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" /> Check-Out Date *
            </Label>
            <Input
              type="date"
              id="checkOut"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
            />
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" /> Guests *
            </Label>
            <Input
              type="number"
              id="guests"
              name="guests"
              min={1}
              value={formData.guests}
              onChange={handleChange}
            />
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <Label htmlFor="roomType" className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-muted-foreground" /> Room Type *
            </Label>
            <Select
              value={formData.roomType}
              onValueChange={(value) => setFormData({ ...formData, roomType: value })}
            >
              <SelectTrigger id="roomType">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deluxe">Deluxe Room</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
                <SelectItem value="Executive">Executive Room</SelectItem>
                <SelectItem value="Standard">Standard Room</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">Note:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Room availability will be checked on save.</li>
              <li>Updated price (if applicable) will reflect at checkout.</li>
              <li>You will receive a confirmation email after update.</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
