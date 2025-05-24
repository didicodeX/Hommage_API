import { Router } from "express";
import donationRoutes from "../features/donation/donation.routes.js";

const router = Router();

router.use("/donations", donationRoutes);

export default router;
