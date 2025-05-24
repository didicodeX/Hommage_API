import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connexion reussie ✅");
  } catch (error) {
    console.log("Connexion echouee ❌", error.message);
  }
};

export default connectDB();
