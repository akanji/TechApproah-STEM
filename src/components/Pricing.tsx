import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useUser } from "./UserContext";

const VITE_STRIPE_PUBLISHABLE_KEY = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY;

const stripePromise = VITE_STRIPE_PUBLISHABLE_KEY ? loadStripe(VITE_STRIPE_PUBLISHABLE_KEY) : null;

export function Pricing() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    setLoading(true);
    setError(null);

    if (!user) {
      setError("Please log in to subscribe.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userEmail: user.email,
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      if (!stripePromise) {
        throw new Error("Stripe publishable key is missing. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.");
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const { error: stripeError } = await (stripe as any).redirectToCheckout({
        sessionId: session.id,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err: any) {
      console.error("Subscription Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 h-full flex flex-col justify-center max-w-lg mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles size={12} /> Premium Access
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Unlock Your Potential</h2>
        <p className="text-[#8b949e] text-sm">Get full access to all virtual labs, AI-powered study aids, and specialist engineering tools.</p>
      </div>

      <div className="bg-[#161b22] border border-blue-500/30 rounded-[32px] p-8 space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Zap size={120} fill="currentColor" className="text-blue-400" />
        </div>

        <div className="space-y-2 relative z-10">
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Pro Subscription</div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">$29</span>
            <span className="text-[#8b949e] text-lg">/month</span>
          </div>
          <p className="text-emerald-400 text-xs font-medium bg-emerald-500/10 inline-block px-2 py-0.5 rounded border border-emerald-500/20 mt-2">
            Includes 7-day Free Trial
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">What's included:</h4>
          <ul className="space-y-3">
            {[
              "All 50+ Virtual Engineering Labs",
              "Unlimited AI Thinking Chat sessions",
              "Specialist AI Hub Access (Titan, SimScale, Flux)",
              "Priority support from AI Experts",
              "Exportable lab reports & certificates",
              "Offline study capability"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[#8b949e]">
                <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <button
          onClick={() => handleSubscribe("price_H5ggv9tG4l2a1z")} // Placeholder Price ID
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
        >
          {loading ? "Preparing Checkout..." : "Start 7-Day Free Trial"}
          {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-[#484f58] uppercase tracking-widest">
          <Shield size={12} /> Secure Checkout powered by Stripe
        </div>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-[#484f58] uppercase tracking-widest leading-relaxed">
          Cancel anytime before trial ends. <br />
          No charges will be applied until the trial period is over.
        </p>
      </div>
    </div>
  );
}
