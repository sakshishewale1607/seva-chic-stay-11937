import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string, details: string) => void;
}

export function CancelBookingDialog({ open, onOpenChange, onConfirm }: CancelBookingDialogProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const handleConfirm = () => {
    if (!reason) return;
    onConfirm(reason, details);
    setReason("");
    setDetails("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    setReason("");
    setDetails("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogDescription>
            We're sorry to see you cancel. Please let us know why you're canceling this booking.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Cancellation Reason *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="change_of_plans">Change of plans</SelectItem>
                <SelectItem value="found_better_deal">Found a better deal</SelectItem>
                <SelectItem value="travel_restrictions">Travel restrictions</SelectItem>
                <SelectItem value="emergency">Emergency situation</SelectItem>
                <SelectItem value="wrong_booking">Booked by mistake</SelectItem>
                <SelectItem value="health_issues">Health issues</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea
              id="details"
              placeholder="Please provide any additional information that might help us improve..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <p className="font-medium mb-1">Cancellation Policy:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Cancellation fee may apply based on hotel policy</li>
              <li>Refund will be processed in 5-7 business days</li>
              <li>Non-refundable bookings cannot be cancelled</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Keep Booking
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!reason}
          >
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
