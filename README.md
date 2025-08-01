# Système de Gestion des Entretiens - Forum d'Entreprise

## 📋 Description

Ce projet vise à développer un site web pour organiser de manière fluide et automatisée les passages aux entretiens entre les étudiants et les entreprises lors d'un forum d'entreprise. Le système élimine les files d'attente physiques, prévient les conflits d'horaires et permet une gestion centralisée de toutes les interactions.

## 🎯 Objectifs Principaux

- ✅ Gérer numériquement les passages aux entretiens
- ✅ Offrir aux participants une interface claire pour suivre leur tour
- ✅ Répartir les passages selon des règles de priorité définies
- ✅ Éviter l'implication directe des représentants des entreprises
- ✅ Offrir aux organisateurs un outil de supervision simple et complet

## 🏗️ Architecture

### Microservices

Le projet est divisé en 5 microservices :

1. **user-service** (Port 3001) - MySQL
   - Gestion des utilisateurs (étudiants, comité, organisateurs)
   - Authentification et autorisation
   - Profils utilisateurs

2. **student-service** (Port 3002) - MySQL
   - Gestion des profils étudiants
   - Inscriptions aux entreprises
   - Historique des entretiens

3. **company-service** (Port 3003) - MongoDB
   - Gestion des entreprises
   - Files d'attente par entreprise
   - Gestion des entretiens en cours

4. **committee-service** (Port 3004) - MongoDB
   - Interface pour les membres du comité
   - Gestion des salles d'entretien
   - Contrôle des entretiens

5. **interview-service** (Port 3005) - MongoDB
   - Orchestration des entretiens
   - Gestion des priorités
   - Notifications en temps réel

## 🚀 Installation et Configuration

### Prérequis

- Node.js (v16 ou supérieur)
- MySQL (v8.0 ou supérieur)
- MongoDB (v5.0 ou supérieur)
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd projet-entretiens
```

2. **Installer les dépendances pour chaque service**
```bash
# User Service
cd backend/user-service
npm install

# Student Service
cd ../student-service
npm install

# Company Service
cd ../company-service
npm install

# Committee Service
cd ../committee-service
npm install

# Interview Service
cd ../interview-service
npm install
```

3. **Configuration des bases de données**

#### MySQL (user-service et student-service)
```sql
-- Créer les bases de données
CREATE DATABASE user_service_db;
CREATE DATABASE student_service_db;
```

#### MongoDB
```bash
# Démarrer MongoDB
mongod

# Les bases de données seront créées automatiquement
```

4. **Variables d'environnement**

Créer un fichier `.env` dans chaque service :

**user-service/.env**
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=user_service_db
JWT_SECRET=your-super-secret-jwt-key
```

**student-service/.env**
```env
PORT=3002
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=student_service_db
JWT_SECRET=your-super-secret-jwt-key
```

**company-service/.env**
```env
PORT=3003
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/company_service
JWT_SECRET=your-super-secret-jwt-key
```

5. **Migrations et démarrage**

```bash
# User Service
cd backend/user-service
npm run db:migrate
npm run dev

# Student Service
cd ../student-service
npm run db:migrate
npm run dev

# Company Service
cd ../company-service
npm run dev
```

## 📊 Structure des Données

### Utilisateurs (MySQL)
- **Étudiants** : nom, email, statut (ENSA/externe), type de stage
- **Comité** : membres organisateurs avec accès aux salles
- **Organisateurs** : administrateurs du système

### Entreprises (MongoDB)
- Informations de base (nom, description, logo)
- Salle attribuée et durée estimée
- Types d'opportunités acceptées
- File d'attente avec priorités

### Inscriptions (MySQL)
- Lien étudiant-entreprise
- Type d'opportunité recherchée
- Position dans la file d'attente
- Statut de l'entretien

## 🔄 Fonctionnement

### Avant le Forum
1. **Configuration** : Les organisateurs configurent les entreprises, salles, durées
2. **Inscription des étudiants** : Les étudiants s'inscrivent et choisissent leurs entreprises
3. **Génération des files** : Le système génère automatiquement les files d'attente

### Pendant le Forum
1. **Suivi en temps réel** : Les étudiants voient leur position dans les files
2. **Notifications** : Alertes à l'approche du tour
3. **Gestion des entretiens** : Le comité contrôle le début/fin des entretiens
4. **Mise à jour automatique** : Les files avancent automatiquement

## 🎯 Règles de Priorité

### Niveaux de Priorité
1. **Niveau 1** : Membres du comité (s'ils sont inscrits)
2. **Niveau 2** : Étudiants ENSA Tétouan
3. **Niveau 3** : Étudiants externes

### Types d'Opportunités (par ordre de priorité)
1. **PFA/PFE** : Priorité maximale
2. **Emploi** : Priorité moyenne
3. **Stage d'observation** : Priorité minimale

## 🔧 API Endpoints

### User Service (Port 3001)
```
POST /api/auth/register     - Inscription utilisateur
POST /api/auth/login        - Connexion
GET  /api/auth/profile      - Profil utilisateur
PUT  /api/auth/profile      - Mise à jour profil
GET  /api/users             - Liste des utilisateurs (admin)
```

### Company Service (Port 3003)
```
GET    /api/companies              - Liste des entreprises
POST   /api/companies              - Créer une entreprise
GET    /api/companies/:id          - Détails d'une entreprise
GET    /api/companies/:id/queue    - File d'attente
POST   /api/companies/:id/queue    - Ajouter à la file
POST   /api/companies/:id/interview/start  - Démarrer entretien
POST   /api/companies/:id/interview/end    - Terminer entretien
```

## 🎨 Interface Utilisateur

### Interface Étudiant
- Création de compte et profil
- Sélection des entreprises et types de stage
- Visualisation des files d'attente en temps réel
- Notifications à l'approche du tour
- Historique des entretiens

### Interface Comité
- Connexion sécurisée
- Vue sur la file d'attente de la salle assignée
- Boutons "Entretien commencé" / "Entretien terminé"
- Suivi des présences

### Interface Organisateur
- Tableau de bord global
- Configuration des entreprises et salles
- Import de la liste du comité
- Statistiques en temps réel
- Gestion des alertes

## 🚀 Déploiement

### Développement
```bash
# Démarrer tous les services
cd backend
npm run dev:all
```

### Production
```bash
# Build et déploiement
npm run build
npm start
```

## 📝 Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour l'ENSA Tétouan**