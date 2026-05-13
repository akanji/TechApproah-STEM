import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
        customer_email: finalEmail,
        payment_method_types: ["card"],
        line_items: [{
          price: priceId, 
          quantity: 1,
        }],
        mode: "subscription",
        subscription_data: {
          trial_period_days: 7,
        },
        success_url: `${origin}/success`,
        cancel_url: `${origin}/pricing`,
      });

      res.json(session);
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
