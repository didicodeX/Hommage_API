import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";
import { stripeWebhookHandler } from "./src/features/webhooks/stripe.webhook.js";
import Stripe from "stripe";

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

app.use("/webhook", express.raw({ type: "application/json" }));

app.post("/webhook", (req, res) => {
  stripeWebhookHandler(
    req,
    res,
    stripe,
    req.headers["stripe-signature"],
    process.env.STRIPE_WEBHOOK_SECRET
  );
});

// Middleware globaux
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// Routes principales
app.use("/", routes);

export default app;
