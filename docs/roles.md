# Gestion des rôles

## Administrateurs

### Responsabilités
- Validation des inscriptions transporteurs
- Gestion des utilisateurs
- Supervision des tournées et réservations
- Accès aux statistiques globales

### Permissions
- Accès complet au tableau de bord admin
- Validation/rejet des demandes d'inscription
- Modification des paramètres système
- Gestion des contenus interdits

### Authentification
- Connexion directe avec email/mot de passe
- Pas de vérification d'email requise
- Accès immédiat aux fonctionnalités

## Clients

### Responsabilités
- Gestion de leur profil
- Création de réservations
- Suivi des colis

### Permissions
- Modification de leur profil
- Création/annulation de réservations
- Accès aux tournées publiques
- Demande d'accès aux tournées privées

### Authentification
- Vérification d'email obligatoire
- Code d'activation requis
- Délai d'activation de 48h

## Transporteurs

### Responsabilités
- Gestion des tournées
- Traitement des réservations
- Mise à jour des statuts

### Permissions
- Création/modification de tournées
- Gestion des points de collecte
- Acceptation/refus des réservations
- Mise à jour des statuts de livraison

### Authentification
- Validation administrative requise
- Trois états possibles :
  1. En attente de validation
  2. Rejeté
  3. Actif (accès complet)