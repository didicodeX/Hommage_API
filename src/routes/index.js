import { Router } from "express";
import donationRoutes from "../features/donation/donation.routes.js";

const router = Router();

router.use("/donations", donationRoutes);

router.get("/", (req, res) => {
  res.send("API is running...");
});

export default router;
