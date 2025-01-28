# Colimero - Documentation

## Vue d'ensemble
Colimero est une plateforme de gestion de transport de colis entre la France et la Tunisie, permettant aux clients d'effectuer des réservations auprès de transporteurs agréés.

## Documentation détaillée

- [Gestion des utilisateurs](docs/users.md)
- [Gestion des rôles](docs/roles.md)
- [Gestion des tournées](docs/tours.md)
- [Gestion des réservations](docs/bookings.md)
- [Profils utilisateurs](docs/profiles.md)
- [Fonctionnalités spécifiques](docs/features.md)

## Workflow d'activation des clients

### Tentative de connexion d'un compte non activé
1. Le client tente de se connecter avec son email/mot de passe
2. Le système vérifie le statut d'activation du compte
3. Si le compte n'est pas activé :
   - Une popup d'activation s'affiche
   - Un nouveau code d'activation est généré et envoyé par email
   - Le client doit saisir le code reçu pour activer son compte
4. Une fois le code validé :
   - Le compte est activé
   - Le client est automatiquement connecté
   - Redirection vers la page d'accueil

### Délais et restrictions
- Le code d'activation est valable pendant 48h
- En cas de code expiré, un nouveau code peut être demandé
- Le compte doit être activé pour accéder aux fonctionnalités de réservation

## Informations techniques

### URL du projet
https://lovable.dev/projects/8c07c2c5-2bba-4106-b598-57cb771d0770

### Technologies utilisées
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend)

### Comment démarrer le projet

```sh
# Cloner le repository
git clone <URL_DU_REPO>

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Support et contact
Pour toute question ou assistance, veuillez contacter l'équipe de support Colimero.