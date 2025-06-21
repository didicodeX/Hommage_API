import axios from "axios";
import * as service from "./donation.service.js";
import Donation from "./donation.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

export const initiateDonation = async (req, res) => {
  const { amount, method, firstName, phone, provider } = req.body;

  if (!amount || !method || !firstName) {
    return res.status(400).json({ error: "Champs requis manquants." });
  }

  try {
    if (method === "card") {
      // Utiliser Stripe Checkout comme tu le fais déjà
      const donation = await Donation.create({
        firstName,
        amount,
        status: "pending",
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "cad",
              product_data: {
                name: `Don en mémoire`,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        customer_creation: "always",
        metadata: {
          donationId: donation._id.toString(),
        },
      });

      return res.json({ url: session.url });
    }

    if (method === "mobile_money") {
      const response = await axios.post(
        "https://api.tiltafrica.com/payments/initiate",
        {
          amount,
          currency: "XAF", // ou "XOF" selon le pays
          payment_method: "MOBILE_MONEY",
          provider, // "ORANGE", "MTN", etc.
          customer: {
            name: firstName,
            phone_number: phone,
          },
          redirect_url: `${process.env.CLIENT_URL}/merci`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TILT_SECRET_KEY}`,
          },
        }
      );

      return res.json({ url: response.data.payment_url });
    }

    return res.status(400).json({ error: "Méthode de paiement invalide." });
  } catch (err) {
    console.error(
      "Erreur initiateDonation:",
      err.response?.data || err.message
    );
    return res.status(500).json({ error: "Erreur serveur." });
  }
};

export const createDonation = async (req, res) => {
  const { firstName, message, amount } = req.body;

  if (!firstName || !amount) {
    return res.status(400).json({ error: "Nom et montant obligatoires." });
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
              name: `Don en mémoire`,
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
