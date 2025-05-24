import Donation from "../donation/donation.model.js";

export const stripeWebhookHandler = async (req, res, stripe, sig, endpointSecret) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Signature Stripe invalide :", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Webhook Stripe reçu :", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // 1. Récupérer l’ID de la donation (envoyé dans metadata)
      const donationId = session.metadata?.donationId;
      if (!donationId) throw new Error("donationId manquant dans metadata");

      // 2. Récupérer les infos du client (si besoin)
      const customer = await stripe.customers.retrieve(session.customer);

      // 3. Mettre à jour la donation dans la base
      await Donation.findByIdAndUpdate(donationId, {
        email: customer.email,
        paymentIntentId: session.payment_intent,
        status: "paid",
      });

      console.log("🎉 Donation mise à jour avec succès");
    } catch (err) {
      console.error("❌ Erreur lors de la mise à jour de la donation :", err.message);
    }
  }

  res.json({ received: true });
};
