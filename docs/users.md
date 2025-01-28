# Gestion des utilisateurs

## Processus d'authentification

### Administrateurs
- Connexion directe avec email/mot de passe
- Aucune vérification supplémentaire requise
- Accès immédiat au tableau de bord admin

### Transporteurs

#### Processus d'inscription
1. Soumission du formulaire avec :
   - Informations personnelles
   - Détails de l'entreprise
   - Documents requis
2. Statut initial : "En attente"
3. Examen par les administrateurs
4. Décision : Approbation ou Rejet

#### États du compte
1. **En attente**
   - Connexion impossible
   - Message d'attente de validation
   - Notification par email lors de la validation

2. **Rejeté**
   - Connexion impossible
   - Message indiquant le motif du rejet
   - Possibilité de contacter le support

3. **Actif**
   - Connexion complète autorisée
   - Accès au tableau de bord transporteur
   - Gestion des tournées et réservations

### Clients

#### Inscription
- Création de compte avec email/mot de passe
- Vérification d'email obligatoire
- Code d'activation valable 48h

#### Workflow d'activation
1. Création du compte
2. Génération du code d'activation
3. Envoi par email
4. Saisie du code
5. Activation du compte
6. Redirection vers la connexion

#### États du compte
1. **Non activé**
   - Connexion limitée
   - Popup d'activation
   - Nouveau code sur demande

2. **Activé**
   - Connexion complète
   - Accès aux réservations
   - Gestion du profil

### Sécurité
- Codes d'activation uniques
- Expiration après 48h
- Validation email obligatoire pour les clients
- Validation administrative pour les transporteurs