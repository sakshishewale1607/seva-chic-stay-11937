export const calculateRefund = (totalAmount: number, bookingDate: Date, cancellationDate: Date): { refundAmount: number; refundPercentage: number; reason: string } => {
  const timeDiff = cancellationDate.getTime() - bookingDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  let refundPercentage = 0;
  let reason = "";
  
  if (daysDiff === 0) {
    // Same day cancellation
    refundPercentage = 100;
    reason = "Cancelled on booking day";
  } else if (daysDiff <= 1) {
    refundPercentage = 90;
    reason = "Cancelled within 24 hours";
  } else if (daysDiff <= 3) {
    refundPercentage = 75;
    reason = "Cancelled within 3 days";
  } else if (daysDiff <= 7) {
    refundPercentage = 50;
    reason = "Cancelled within 7 days";
  } else if (daysDiff <= 14) {
    refundPercentage = 25;
    reason = "Cancelled within 14 days";
  } else {
    refundPercentage = 0;
    reason = "Cancelled after 14 days";
  }
  
  const refundAmount = Math.round((totalAmount * refundPercentage) / 100);
  
  return { refundAmount, refundPercentage, reason };
};

export const getRefundPolicyText = () => {
  return `
**Cancellation & Refund Policy**

We understand that plans can change. Here's our refund policy:

• **Same day cancellation**: 100% refund
• **Within 24 hours**: 90% refund
• **Within 3 days**: 75% refund
• **Within 7 days**: 50% refund
• **Within 14 days**: 25% refund
• **After 14 days**: No refund

Refunds will be processed within 5-7 business days to the original payment method.

**Important Notes:**
- Refund calculations are based on the time elapsed from booking date to cancellation date
- Convenience fees and processing charges are non-refundable
- Special offers and promotional bookings may have different cancellation terms
  `;
};
