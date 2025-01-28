# Gestion des utilisateurs

## Clients

### Inscription
- Les clients peuvent créer un compte en fournissant leurs informations personnelles

### Activation du compte
- Un code d'activation est envoyé par email
- Le code est valable pendant 48h
- Le compte doit être activé pour pouvoir effectuer des réservations

### Workflow d'activation
1. Création du compte avec email/mot de passe
2. Génération automatique d'un code d'activation unique
3. Envoi du code par email
4. Saisie du code dans l'interface d'activation
5. Vérification et activation du compte
6. Redirection vers la connexion

## Transporteurs

### Inscription
- Les transporteurs soumettent une demande d'inscription avec leurs informations

### Validation
- La demande est examinée par les administrateurs
- Vérification des documents et informations fournis
- Activation du compte après validation

### Workflow de validation
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