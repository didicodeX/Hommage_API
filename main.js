// 1. Charger les variables d’environnement
import "dotenv/config";

// 2. Connexion à la base de données
import "./src/config/database.config.js";

// 3. Importer l'application Express
import app from "./app.js";

// 4. Lancer le serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
