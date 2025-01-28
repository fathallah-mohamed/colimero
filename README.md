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

### Gestion des rôles

#### Administrateurs
- **Responsabilités** :
  - Validation des inscriptions transporteurs
  - Gestion des utilisateurs
  - Supervision des tournées et réservations
  - Accès aux statistiques globales
- **Permissions** :
  - Accès complet au tableau de bord admin
  - Validation/rejet des demandes d'inscription
  - Modification des paramètres système
  - Gestion des contenus interdits

#### Clients
- **Responsabilités** :
  - Gestion de leur profil
  - Création de réservations
  - Suivi des colis
- **Permissions** :
  - Modification de leur profil
  - Création/annulation de réservations
  - Accès aux tournées publiques
  - Demande d'accès aux tournées privées

#### Transporteurs
- **Responsabilités** :
  - Gestion des tournées
  - Traitement des réservations
  - Mise à jour des statuts
- **Permissions** :
  - Création/modification de tournées
  - Gestion des points de collecte
  - Acceptation/refus des réservations
  - Mise à jour des statuts de livraison

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

#### Workflow de création de tournée
1. **Planification** :
   - Définition des dates (départ, collecte)
   - Sélection des points de collecte
   - Configuration de la capacité
2. **Configuration** :
   - Choix du type (publique/privée)
   - Définition des villes desservies
   - Configuration des tarifs
3. **Validation** :
   - Vérification des informations
   - Acceptation des conditions
   - Publication de la tournée

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

#### Workflow de validation des réservations
1. **Création** :
   - Saisie des informations
   - Vérification des disponibilités
   - Calcul du prix
2. **Validation** :
   - Vérification par le transporteur
   - Confirmation ou refus
   - Notification au client
3. **Suivi** :
   - Mise à jour des statuts
   - Notifications aux parties
   - Confirmation de livraison

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

#### Workflow de demande d'accès aux tournées privées
1. **Soumission** :
   - Sélection de la tournée
   - Motif de la demande
   - Informations complémentaires
2. **Traitement** :
   - Examen par le transporteur
   - Vérification des critères
   - Décision d'approbation
3. **Finalisation** :
   - Notification de la décision
   - Accès accordé si approuvé
   - Possibilité de réservation

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