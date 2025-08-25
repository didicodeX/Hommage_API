import Donation from "./donation.model.js";

export const getAllDonations = async () => {
  return await Donation.find({ status: "paid" }).sort({ createdAt: -1 });
};

export const getRecentDonations = async (limit = 5) => {
  return await Donation.find({ status: "paid" })
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getDonationStats = async () => {
  const totalAmount = await Donation.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalCount = await Donation.countDocuments({ status: "paid" });

  const GOAL_AMOUNT = 1000; // Valeur cible fixe ou récupérée d'ailleurs

  return {
    totalAmount: totalAmount[0]?.total || 0,
    goalAmount: GOAL_AMOUNT,
    totalCount,
  };
};
