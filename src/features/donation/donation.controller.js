import * as service from "./donation.service.js";
import Donation from "./donation.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createDonation = async (req, res) => {
  const { firstName, message, amount } = req.body;

  if (!firstName || !amount) {
    return res.status(400).json({ error: "Nom et montant obligatoires." });
  }

  // Validation du montant
  if (amount <= 0 || amount > 10000) {
    return res
      .status(400)
      .json({ error: "Le montant doit être entre 1 et 10,000 CAD." });
  }

  try {
    // 1. Enregistrer la donation temporairement
    const donation = await Donation.create({
      firstName,
      message,
      amount,
      status: "pending",
    });

    // 2. Créer une session Stripe Checkout avec metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `Don en mémoire de Papa Takam Robert`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_creation: "always", // ✅ permet d’avoir un customer attaché à la session
      metadata: {
        donationId: donation._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Erreur createDonation :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getRecentDonors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const donors = await service.fetchRecentDonorsService(limit);
    res.json(donors);
  } catch (err) {
    console.error("Erreur récupération des donateurs :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getDonationStats = async (req, res) => {
  try {
    const stats = await service.fetchStatsService();
    res.json(stats);
  } catch (err) {
    console.error("Erreur stats dons :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await service.fetchAllDonationService();
    if (!donations) {
      return res.status(404).json({ message: "Aucune donation trouvée" });
    }
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
