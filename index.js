// 1. Charger les variables d’environnement
import "dotenv/config";

// 2. Connexion à la base de données
import "./src/config/database.config.js";

// 3. Importer l'application Express
import app from "./src/express-app.js";

// 4. Lancer le serveur en local / sur un hébergeur classique.
// Sur Vercel, l'app exportée est servie directement par une Vercel Function.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
}

export default app;
