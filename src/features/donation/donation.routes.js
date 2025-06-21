import { Router } from "express";
import {
  initiateDonation,
  createDonation,
  getAllDonations,
  getRecentDonors,
  getDonationStats,
} from "./donation.controller.js";

const router = Router();

router.post("/initiate", initiateDonation); // POST /donations/initiate
router.post("/", createDonation); // POST /donations/create
router.get("/", getAllDonations); // GET /donations
router.get("/recent", getRecentDonors); // GET /donations/recent
router.get("/stats", getDonationStats); // GET /donations/stats

export default router;
