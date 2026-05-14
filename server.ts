import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";

import admin from "firebase-admin";
import firebaseConfig from "./firebase-applet-config.json";

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = admin.firestore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to get user from Firestore
  const getUserFromDB = async (email: string) => {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).limit(1).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  };

  let stripe: Stripe | null = null;
  const getStripe = () => {
    if (!stripe) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        // We don't throw here to avoid crashing the whole server on startup,
        // but we will throw when an endpoint that needs it is called.
        console.warn("STRIPE_SECRET_KEY not found in environment variables.");
      } else {
        stripe = new Stripe(key);
      }
    }
    return stripe;
  };

  // API Routes
  app.get("/api/check-access", async (req, res) => {
    const email = req.query.email as string;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const user = await getUserFromDB(email);
      
      if (!user) {
        return res.json({ access: false, error: "User not found" });
      }

      const now = Date.now();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      // Parse trial date (handling both timestamp and ISO string for robustness)
      const trialStart = typeof user.trialStartedAt === 'number' 
        ? user.trialStartedAt 
        : new Date(user.trialStartedAt).getTime();

      // Check if within 7-day window
      const isTrialActive = (now - trialStart) < sevenDaysInMs;

      if (user.isSubscribed || isTrialActive) {
        return res.json({ 
          access: true, 
          isSubscribed: user.isSubscribed,
          daysLeft: Math.max(0, Math.ceil((sevenDaysInMs - (now - trialStart)) / (1000 * 60 * 60 * 24)))
        });
      } else {
        // Redirect to Billing if trial expired
        return res.json({ access: false, redirectTo: "/pricing" });
      }
    } catch (error: any) {
      console.error("Check Access Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/create-subscription", async (req, res) => {
    const { priceId, customerEmail, userEmail } = req.body;
    const finalEmail = customerEmail || userEmail;
    
    const stripeInstance = getStripe();
    if (!stripeInstance) {
      return res.status(500).json({ error: "Stripe is not configured on the server." });
    }

    try {
      const origin = req.headers.origin || process.env.APP_URL || `http://localhost:${PORT}`;
      
      const session = await stripeInstance.checkout.sessions.create({
        // ✅ Enable 'link' for "Pay with Link". 
        // Note: Code delivery (SMS vs Email) is managed by Stripe/Link account settings.
        payment_method_types: ["card", "link"], 
        mode: "subscription",
        line_items: [{
          price: priceId, 
          quantity: 1,
        }],
        // No trial_period_days here so they pay immediately after their 7-day in-app trial
        customer_email: finalEmail,
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pricing`,
      });

      // ✅ FIX: Return the URL for a standard browser redirect
      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Session Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
