## Hommage

## Développement local

```bash
cp .env.example .env   # puis remplir les valeurs
npm install
npm run dev
```

## Déploiement sur Vercel (gratuit)

L'API est une app Express déployée sans configuration sur Vercel : `index.js` exporte l'app, Vercel la sert via une Vercel Function. En local (ou sur tout hébergeur classique), `index.js` lance `app.listen` comme avant.

1. Vercel → **Add New Project** → importer `didicodeX/Hommage_API` (Framework : Express, détecté automatiquement).
2. Ajouter les variables d'environnement de `.env.example` (sauf `PORT`).
3. Déployer, puis vérifier que `GET /` répond `API is running...`.
4. Dans Stripe → Developers → Webhooks, pointer l'endpoint vers `https://<nouvelle-url>/webhook` et copier le nouveau secret dans `STRIPE_WEBHOOK_SECRET`.
5. Dans le projet Vercel du front (Hommage), mettre `VITE_API_URL=https://<nouvelle-url>` puis redéployer.
