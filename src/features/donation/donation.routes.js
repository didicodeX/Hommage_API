import { Router } from "express";
import { createDonation } from "./donation.controller.js";

const router = Router();

router.post("/create", createDonation); // POST /donations/create

export default router;
