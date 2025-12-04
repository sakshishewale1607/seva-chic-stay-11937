import { useEffect, useState } from "react";

export default function WinterOffer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const end = new Date();
    end.setDate(end.getDate() + 3);

    const update = () => {
      const now = new Date();
      let diff = Math.max(0, end.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * 24 * 60 * 60 * 1000;
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      diff -= hrs * 60 * 60 * 1000;
      const mins = Math.floor(diff / (1000 * 60));
      diff -= mins * 60 * 1000;
      const secs = Math.floor(diff / 1000);
      setTimeLeft(`${days}d ${hrs}h ${mins}m ${secs}s left`);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex justify-center items-center py-16 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
      <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-large p-8 max-w-lg text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">❄️ Winter Special Offer</h2>
        <p className="text-lg mb-6">
          Enjoy your luxury stay this winter with{" "}
          <strong>30% OFF</strong> on all bookings!
        </p>
        <div className="text-xl font-semibold mb-6">{timeLeft}</div>
        <button className="bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-full hover:bg-accent-hover hover:scale-105 transition">
          Book Now
        </button>
      </div>
    </section>
  );
}

