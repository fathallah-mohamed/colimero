# Colimero - Documentation

## Vue d'ensemble
Colimero est une plateforme de gestion de transport de colis entre la France et la Tunisie, permettant aux clients d'effectuer des réservations auprès de transporteurs agréés.

## Fonctionnalités principales

### Gestion des utilisateurs

#### Clients
- **Inscription** : Les clients peuvent créer un compte en fournissant leurs informations personnelles
- **Activation du compte** : 
  - Un code d'activation est envoyé par email
  - Le code est valable pendant 48h
  - Le compte doit être activé pour pouvoir effectuer des réservations
- **Workflow d'activation** :
  1. Création du compte avec email/mot de passe
  2. Génération automatique d'un code d'activation unique
  3. Envoi du code par email
  4. Saisie du code dans l'interface d'activation
  5. Vérification et activation du compte
  6. Redirection vers la connexion

#### Transporteurs
- **Inscription** : Les transporteurs soumettent une demande d'inscription avec leurs informations
- **Validation** : 
  - La demande est examinée par les administrateurs
  - Vérification des documents et informations fournis
  - Activation du compte après validation
- **Workflow de validation** :
  1. Soumission du formulaire d'inscription avec :
     - Informations de l'entreprise (SIRET, nom, etc.)
     - Documents légaux
     - Capacités et services proposés
  2. Examen par les administrateurs :
     - Vérification des documents
     - Validation des informations légales
     - Contrôle des capacités déclarées
  3. Décision :
     - Approbation : Création du compte et envoi d'email de confirmation
     - Rejet : Notification avec motif de refus
  4. Post-approbation :
     - Accès au tableau de bord transporteur
     - Possibilité de créer des tournées
     - Gestion des réservations

### Gestion des tournées

#### Types de tournées
- **Publiques** : Accessibles à tous les clients
- **Privées** : Nécessitent une demande d'approbation avant réservation

#### Statuts des tournées
1. **Programmée** : Tournée créée et ouverte aux réservations
2. **Ramassage en cours** : Phase de collecte des colis
3. **En transit** : Transport des colis vers la destination
4. **Livraison en cours** : Distribution des colis aux destinataires
5. **Terminée** : Tournée complétée
6. **Annulée** : Tournée annulée

### Gestion des réservations

#### Processus de réservation
1. Sélection d'une tournée
2. Choix du point de collecte
3. Saisie des informations du colis et du destinataire
4. Confirmation de la réservation

#### Statuts des réservations
- **En attente** : Réservation créée
- **Confirmée** : Acceptée par le transporteur
- **Collectée** : Colis récupéré
- **En transit** : En cours de transport
- **Livrée** : Colis remis au destinataire
- **Annulée** : Réservation annulée

### Profils utilisateurs

#### Profil client
- Gestion des informations personnelles
- Historique des réservations
- Suivi des colis en cours
- Gestion des destinataires favoris

#### Profil transporteur
- Gestion des informations de l'entreprise
- Gestion des capacités et tarifs
- Planning des tournées
- Suivi des réservations
- Gestion des points de collecte

### Fonctionnalités spécifiques

#### Tournées privées
- Réservées à des clients spécifiques
- Processus de demande d'approbation
- Validation requise avant réservation

#### Gestion des points de collecte
- Définition des villes de collecte
- Horaires de passage
- Capacités par point de collecte

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

### Déploiement
Pour déployer l'application, utilisez l'option de déploiement dans l'interface Lovable ou déployez manuellement sur votre hébergeur préféré.

## Support et contact
Pour toute question ou assistance, veuillez contacter l'équipe de support Colimero.