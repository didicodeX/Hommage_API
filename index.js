// 1. Charger les variables d’environnement
import "dotenv/config";

// 2. Connexion à la base de données
import "./src/config/database.config.js";

import express from "express";
import cors from "cors";
import Stripe from "stripe";
import routes from "./src/routes/index.js";
import { stripeWebhookHandler } from "./src/features/webhooks/stripe.webhook.js";

// 3. Application Express
const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Le webhook Stripe a besoin du corps brut (avant express.json)
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

// 4. Lancer le serveur en local / sur un hébergeur classique.
// Sur Vercel, l'app exportée est servie directement par une Vercel Function.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
}

export default app;
