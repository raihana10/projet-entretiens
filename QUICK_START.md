# 🚀 Guide de Démarrage Rapide - Système de Gestion des Entretiens

## 📋 Vue d'ensemble

Ce projet est un système complet de gestion des entretiens pour un forum d'entreprise, composé de 5 microservices :

- **user-service** (Port 3001) - MySQL
- **student-service** (Port 3002) - MySQL  
- **company-service** (Port 3003) - MongoDB
- **committee-service** (Port 3004) - MongoDB
- **interview-service** (Port 3005) - MongoDB

## ⚡ Installation Rapide

### 1. Prérequis
```bash
# Vérifier Node.js (v16+)
node --version

# Vérifier npm
npm --version

# Installer MySQL et MongoDB
# MySQL: https://dev.mysql.com/downloads/
# MongoDB: https://docs.mongodb.com/manual/installation/
```

### 2. Installation Automatique
```bash
# Cloner le projet
git clone <repository-url>
cd projet-entretiens

# Installation automatique (Linux/Mac)
chmod +x install.sh
./install.sh

# Ou installation manuelle
npm run install:all
```

### 3. Configuration des Bases de Données

#### MySQL
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

### 4. Variables d'Environnement

Créer les fichiers `.env` dans chaque service :

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

**committee-service/.env**
```env
PORT=3004
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/committee_service
JWT_SECRET=your-super-secret-jwt-key
```

**interview-service/.env**
```env
PORT=3005
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/interview_service
JWT_SECRET=your-super-secret-jwt-key
```

### 5. Migrations et Démarrage

```bash
# Exécuter les migrations MySQL
npm run migrate:all

# Démarrer tous les services
npm run dev:all

# Ou démarrer individuellement
npm run dev:user
npm run dev:student
npm run dev:company
npm run dev:committee
npm run dev:interview
```

## 🔧 Services Disponibles

| Service | Port | Base de Données | Description |
|---------|------|-----------------|-------------|
| user-service | 3001 | MySQL | Gestion des utilisateurs et authentification |
| student-service | 3002 | MySQL | Gestion des profils étudiants |
| company-service | 3003 | MongoDB | Gestion des entreprises et files d'attente |
| committee-service | 3004 | MongoDB | Interface pour les membres du comité |
| interview-service | 3005 | MongoDB | Orchestration des entretiens |

## 📡 API Endpoints Principaux

### User Service (Port 3001)
```bash
# Authentification
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile

# Gestion des utilisateurs
GET  /api/users
POST /api/users
GET  /api/users/:id
```

### Company Service (Port 3003)
```bash
# Gestion des entreprises
GET  /api/companies
POST /api/companies
GET  /api/companies/:id

# Files d'attente
GET  /api/companies/:id/queue
POST /api/companies/:id/queue
```

### Interview Service (Port 3005)
```bash
# Gestion des entretiens
GET  /api/interviews
POST /api/interviews
POST /api/interviews/:id/start
POST /api/interviews/:id/end

# Statistiques
GET  /api/interviews/stats
```

## 🧪 Tests Rapides

### 1. Vérifier la santé des services
```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
```

### 2. Créer un utilisateur test
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student",
    "studentType": "ENSA"
  }'
```

### 3. Créer une entreprise test
```bash
curl -X POST http://localhost:3003/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "description": "A test company",
    "industry": "Technology",
    "location": "Tétouan",
    "contactEmail": "contact@testcompany.com",
    "room": "A101",
    "estimatedDuration": 15
  }'
```

## 🎯 Fonctionnalités Clés

### ✅ Implémentées
- [x] Architecture microservices
- [x] Authentification JWT
- [x] Gestion des utilisateurs (étudiants, comité, organisateurs)
- [x] Gestion des entreprises
- [x] Files d'attente avec priorités
- [x] Gestion des entretiens
- [x] Notifications en temps réel (Socket.IO)
- [x] Résolution automatique des conflits
- [x] Statistiques et rapports
- [x] API REST complète

### 🔄 En Cours de Développement
- [ ] Interface utilisateur React
- [ ] Tests automatisés
- [ ] Déploiement Docker
- [ ] Monitoring et logging
- [ ] Documentation API complète

## 🚨 Dépannage

### Problèmes Courants

1. **Erreur de connexion MySQL**
```bash
# Vérifier que MySQL est démarré
sudo service mysql start

# Vérifier les credentials dans .env
```

2. **Erreur de connexion MongoDB**
```bash
# Vérifier que MongoDB est démarré
mongod

# Vérifier l'URI dans .env
```

3. **Port déjà utilisé**
```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :300

# Changer le port dans .env si nécessaire
```

4. **Erreur de migration**
```bash
# Réinitialiser les bases de données
npm run reset:all

# Relancer les migrations
npm run migrate:all
```

## 📞 Support

- **Documentation complète** : `README.md`
- **Issues** : GitHub Issues
- **Contact** : Équipe de développement ENSA Tétouan

## 🎉 Prochaines Étapes

1. **Développer l'interface React**
2. **Ajouter des tests unitaires**
3. **Configurer le déploiement**
4. **Implémenter la sécurité avancée**
5. **Ajouter des fonctionnalités avancées**

---

**🎯 Objectif** : Système opérationnel pour le forum d'entreprise ENSA Tétouan 2024 