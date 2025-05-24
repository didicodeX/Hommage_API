import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
    paymentIntentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Donation", donationSchema);
