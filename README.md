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

## Règles d'authentification

### Administrateurs
- Connexion directe avec email/mot de passe
- Pas de vérification d'email requise
- Accès complet au tableau de bord administrateur

### Transporteurs
1. **Compte en attente**
   - Message indiquant que le compte est en attente de validation
   - Pas de possibilité de connexion avant validation
2. **Compte rejeté**
   - Message indiquant le rejet de la demande
   - Connexion impossible
3. **Compte actif**
   - Connexion directe avec email/mot de passe
   - Accès au tableau de bord transporteur

### Clients
1. **Première connexion**
   - Vérification du statut d'activation requise
   - Code d'activation envoyé par email
2. **Compte non activé**
   - Popup d'activation affichée
   - Nouveau code d'activation généré et envoyé
3. **Compte activé**
   - Connexion directe avec email/mot de passe
   - Accès aux fonctionnalités de réservation

### Délais et restrictions
- Code d'activation valable 48h
- Nouveau code disponible sur demande
- Activation obligatoire pour les clients
- Validation administrative obligatoire pour les transporteurs

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