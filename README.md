# Plan'it — API Backend

*[Read this in English](docs/README.en.md)*

API REST pour **Plan'it**, une application de gestion de bénévoles pour un club de badminton. Elle permet aux administrateurs de créer des événements et des missions avec des créneaux horaires, et aux bénévoles de s'inscrire aux créneaux qui les intéressent.

## 🧱 Stack technique

- **[NestJS](https://nestjs.com/)** — framework Node.js structuré en modules/controllers/services
- **[Prisma ORM](https://www.prisma.io/)** + **MySQL** — accès aux données et migrations
- **JWT** (access + refresh token) — authentification, avec `jsonwebtoken` via `@nestjs/jwt`
- **[Argon2](https://github.com/ranisalt/node-argon2)** — hachage des mots de passe
- **[class-validator](https://github.com/typestack/class-validator)** — validation des DTO
- **[Resend](https://resend.com/)** — envoi d'emails transactionnels (bienvenue, réinitialisation de mot de passe)
- **Docker / docker-compose** — environnement de développement conteneurisé (API + MySQL + phpMyAdmin)
- **Jest** — tests unitaires

## ✨ Fonctionnalités principales

- **Authentification** : inscription, connexion, déconnexion, rafraîchissement de token, mot de passe oublié / réinitialisation, changement de mot de passe
- **Gestion des utilisateurs** : profils, rôles (admin / bénévole), compétences, onboarding
- **Gestion des événements** : création, modification, suppression, documents associés
- **Gestion des missions** : missions liées à un événement, associées à des compétences requises
- **Gestion des créneaux (mission slots)** : créneaux horaires par mission, avec nombre de bénévoles maximum, création manuelle ou automatique (génération de plusieurs créneaux d'un coup)
- **Inscriptions aux créneaux** : un bénévole peut s'inscrire/se désinscrire d'un créneau, avec vérification des places disponibles et des doublons d'inscription
- **Statistiques** : missions/événements à venir, taux de remplissage, alertes sur les missions sous-remplies

## 🔐 Sécurité

- Mots de passe hachés avec **Argon2**, jamais stockés ni renvoyés en clair
- **Double token JWT** : `accessToken` (courte durée, 15 min par défaut) signé avec un secret dédié, `refreshToken` (longue durée, 7 jours par défaut) signé avec un **secret différent**, stocké côté client dans un **cookie `httpOnly` + `secure` + `sameSite: strict`**
- **Guards** (`AuthGuard`, `RolesGuard`) sur les routes sensibles, avec vérification des rôles (`@Roles('admin')`)
- Toutes les relations Prisma exposant des données utilisateur utilisent un `select` explicite (whitelist des champs), jamais `include: { user: true }` brut, pour ne jamais exposer par erreur les mots de passe hachés ou les emails
- Le champ `role` est explicitement retiré des données transmises à la route de mise à jour de profil (`PATCH /user`), pour empêcher toute élévation de privilège — le changement de rôle passe uniquement par une route dédiée, réservée aux administrateurs
- Vérification systématique des droits (auteur de la ressource ou admin) avant suppression/désinscription

## 🚀 Installation

### Prérequis
- Node.js 20+
- Docker et Docker Compose
- npm

### Étapes

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd <nom-du-dossier>

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env (voir la section Variables d'environnement ci-dessous)

# 4. Lancer les services (API + MySQL + phpMyAdmin) avec Docker
docker compose up --build

# 5. Appliquer les migrations Prisma (si non fait automatiquement au démarrage du conteneur)
npx prisma migrate deploy

# 6. Générer le client Prisma
npx prisma generate
```

L'API est alors disponible sur `http://localhost:3000`, et phpMyAdmin sur `http://localhost:8081`.

## ⚙️ Variables d'environnement

Créer un fichier `.env` à la racine du projet, avec les variables suivantes :

```env
# Base de données
DATABASE_URL="mysql://root:root@localhost:3308/testdb"

# JWT
ACCESSSECRET=un_secret_aleatoire_long_et_unique
REFRESHSECRET=un_autre_secret_aleatoire_different_du_premier
ACCESEXPIRE=15m
REFRESHEXPIRE=7d
JWTALGORITHM=HS512

# CORS — origines autorisées à appeler l'API (séparées par des virgules)
CORS_ORIGINS_URL=http://localhost:5173

# Serveur
PORT=3000

# Emails (Resend)
RESEND_API_KEY=ta_clé_api_resend

# URL du front, utilisée dans les liens envoyés par email (ex: réinitialisation de mot de passe)
FRONTEND_URL=http://localhost:5173
```

⚠️ Ce fichier ne doit **jamais** être commité — il est dans `.gitignore`. Conserve une copie de sauvegarde en dehors du dépôt Git.

## 🗄️ Base de données

Le schéma est géré avec Prisma (`prisma/schema.prisma`). Modèles principaux : `User`, `Evnt` (événement), `Mission`, `MissionSlot`, `User_Has_Mission`, `Skill`, `User_has_Skill`, `Mission_Has_Skill`, `Category`, `Document`, `Event_Has_Document`.

Relations clés :
- Un événement (`Evnt`) contient plusieurs missions (`Mission`) — relation 1-N
- Une mission contient plusieurs créneaux (`MissionSlot`) — relation 1-N
- Un bénévole peut s'inscrire à plusieurs créneaux, un créneau peut avoir plusieurs bénévoles — relation N-N via la table de liaison `User_Has_Mission`

### Commandes utiles

```bash
# Créer une nouvelle migration après modification du schéma
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Ouvrir Prisma Studio (interface graphique pour explorer la base)
npx prisma studio
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests unitaires en mode watch
npm run test:watch

# Couverture de tests
npm run test:cov
```

Les tests unitaires mockent `PrismaService` (via `jest.fn()`) pour tester la logique des services de façon isolée, sans dépendre d'une vraie base de données.

## 📁 Structure du projet

```
src/
├── auth/              # Authentification (login, signup, refresh, guards)
├── user/              # Gestion des utilisateurs
├── evnt/               # Gestion des événements
├── mission/            # Gestion des missions
├── mission-slot/       # Gestion des créneaux
├── user-has-mission/   # Inscriptions aux créneaux
├── mail/                # Envoi d'emails (Resend)
prisma/
├── schema.prisma        # Schéma de la base de données
├── migrations/           # Historique des migrations
utils/
├── interface/            # Interfaces partagées (ex: format de réponse standardisé)
```

## 📦 Format des réponses API

Certaines routes (notamment l'authentification) renvoient une réponse enveloppée dans une structure standardisée :

```typescript
interface IResponse<T> {
    data: T
    timeStamp: Date
    url: string
}
```

D'autres routes renvoient directement la ressource, sans enveloppe. Se référer au controller concerné pour connaître le format exact de chaque route.

## 🌐 Déploiement

Le projet est conçu pour être déployé via Docker. Le `Dockerfile` de production doit utiliser un build compilé (`npm run build` + `npm run start:prod`) plutôt que le mode développement (`start:dev`). Pensez à adapter les variables d'environnement (`secure: true` pour les cookies uniquement en HTTPS, `CORS_ORIGINS_URL` avec le domaine réel du front, etc.) selon l'environnement cible.