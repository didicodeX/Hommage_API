import * as repo from "./donation.repository.js";

export const fetchAllDonationService = async () => {
  return await repo.getAllDonations();
};

export const fetchRecentDonorsService = async (limit) => {
  return await repo.getRecentDonations(limit);
};

export const fetchStatsService = async () => {
  return await repo.getDonationStats();
};
