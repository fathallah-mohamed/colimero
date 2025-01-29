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

#### Processus d'inscription détaillé
1. **Création du compte**
   - Saisie des informations obligatoires :
     * Email
     * Mot de passe
     * Nom et prénom
     * Téléphone
   - Acceptation des conditions d'utilisation
   - Soumission du formulaire

2. **Vérification d'email**
   - Email automatique envoyé avec code d'activation
   - Code valable 48h
   - Possibilité de demander un nouveau code
   - Format du code : 6 caractères alphanumériques

3. **Activation du compte**
   - Saisie du code reçu par email
   - Trois tentatives maximum
   - En cas d'échec, possibilité de demander un nouveau code

#### États du compte client

1. **Nouveau compte (pending)**
   - Créé après inscription
   - Email non vérifié
   - Accès limité à l'application
   - Code d'activation envoyé

2. **En attente d'activation**
   - Code d'activation généré
   - Email envoyé
   - Connexion possible mais limitée
   - Popup d'activation affiché

3. **Code expiré**
   - 48h écoulées sans activation
   - Connexion bloquée
   - Message d'expiration
   - Option de renvoi de code

4. **Compte activé (active)**
   - Email vérifié
   - Accès complet à l'application
   - Possibilité de faire des réservations
   - Gestion du profil

#### Scénarios de connexion

1. **Première connexion avant activation**
   - Redirection vers popup d'activation
   - Message explicatif
   - Option de renvoi de code

2. **Connexion avec code expiré**
   - Message d'expiration
   - Option de renvoi de code
   - Nouveau délai de 48h

3. **Connexion après activation**
   - Accès direct au tableau de bord
   - Toutes les fonctionnalités disponibles

#### Gestion des erreurs

1. **Code invalide**
   - Message d'erreur explicite
   - Compteur de tentatives
   - Option de renvoi après 3 échecs

2. **Email non reçu**
   - Option de renvoi immédiat
   - Vérification des spams suggérée
   - Support contact disponible

3. **Compte déjà existant**
   - Message indiquant l'existence du compte
   - Redirection vers la connexion
   - Option "Mot de passe oublié"

### Sécurité et validation

#### Email
- Format valide requis
- Unicité vérifiée
- Double opt-in via activation

#### Mot de passe
- Minimum 8 caractères
- Au moins une majuscule
- Au moins un chiffre
- Caractères spéciaux recommandés

#### Code d'activation
- 6 caractères alphanumériques
- Sensible à la casse
- Expiration après 48h
- Limité à 3 tentatives

#### Protection des données
- Cryptage des mots de passe
- Tokens d'activation uniques
- Session sécurisée
- Déconnexion automatique après inactivité