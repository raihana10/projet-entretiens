# Interview Manager - Système de Gestion des Entretiens

Application complète pour la gestion des entretiens d'embauche et d'évaluation, comprenant un backend microservices et un frontend React moderne.

## 🏗️ Architecture

### Backend (Microservices)
- **User Service** (Port 3001) : Authentification et gestion des utilisateurs
- **Student Service** (Port 3002) : Gestion des étudiants et inscriptions
- **Interview Service** (Port 3003) : Gestion des entretiens
- **Committee Service** (Port 3004) : Gestion des comités d'entretien
- **Company Service** (Port 3005) : Gestion des entreprises

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling moderne
- **React Query** pour la gestion d'état
- **React Router** pour la navigation
- Interface responsive et intuitive

## 🚀 Démarrage Rapide

### Option 1 : Démarrage complet (Recommandé)
```powershell
# Démarrer tous les services (backend + frontend)
.\start-all.ps1
```

### Option 2 : Démarrage séparé
```powershell
# 1. Démarrer les services backend
.\start-services.ps1

# 2. Dans un nouveau terminal, démarrer le frontend
.\start-frontend.ps1
```

### Option 3 : Démarrage manuel
```bash
# Backend
cd backend/user-service && npm start
cd backend/student-service && npm start
cd backend/interview-service && npm start
cd backend/committee-service && npm start
cd backend/company-service && npm start

# Frontend
cd frontend && npm install && npm start
```

## 📍 Accès aux Services

- **Frontend** : http://localhost:3000
- **User Service** : http://localhost:3001
- **Student Service** : http://localhost:3002
- **Interview Service** : http://localhost:3003
- **Committee Service** : http://localhost:3004
- **Company Service** : http://localhost:3005

## 🔐 Comptes de Démonstration

### Frontend
- **Admin** : admin@example.com / password123
- **Étudiant** : student@example.com / password123
- **Comité** : committee@example.com / password123

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** avec Express
- **PostgreSQL** avec Sequelize ORM
- **JWT** pour l'authentification
- **CORS** pour la communication inter-services
- **Helmet** pour la sécurité

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **React Query** pour la gestion d'état
- **React Hook Form** avec Yup validation
- **Lucide React** pour les icônes
- **React Hot Toast** pour les notifications

## 📁 Structure du Projet

```
projet-entretiens/
├── backend/
│   ├── user-service/          # Service d'authentification
│   ├── student-service/       # Service des étudiants
│   ├── interview-service/     # Service des entretiens
│   ├── committee-service/     # Service des comités
│   ├── company-service/       # Service des entreprises
│   └── STRUCTURE.md          # Documentation backend
├── frontend/
│   ├── src/
│   │   ├── components/       # Composants React
│   │   ├── pages/           # Pages de l'application
│   │   ├── services/        # Services API
│   │   ├── types/           # Types TypeScript
│   │   ├── contexts/        # Contextes React
│   │   └── utils/           # Utilitaires
│   ├── public/              # Fichiers publics
│   └── README.md            # Documentation frontend
├── start-services.ps1       # Script démarrage backend
├── start-frontend.ps1       # Script démarrage frontend
├── start-all.ps1           # Script démarrage complet
└── README.md               # Ce fichier
```

## 🔧 Configuration

### Prérequis
- **Node.js** (v16 ou supérieur)
- **npm** ou **yarn**
- **PostgreSQL** (v12 ou supérieur)
- **PowerShell** (Windows)

### Variables d'environnement
Créez un fichier `.env` dans chaque service backend :

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=service_name_dev

# JWT
JWT_SECRET=your-secret-key

# Port du service
PORT=3001
```

### Base de données
```sql
-- Créer les bases de données pour chaque service
CREATE DATABASE user_service_dev;
CREATE DATABASE student_service_dev;
CREATE DATABASE interview_service_dev;
CREATE DATABASE committee_service_dev;
CREATE DATABASE company_service_dev;
```

## 📊 Fonctionnalités

### 🔐 Authentification
- Connexion/déconnexion sécurisée
- Gestion des rôles (Admin, Étudiant, Comité, Entreprise)
- Protection des routes
- Tokens JWT

### 👥 Gestion des Utilisateurs
- Création et modification de comptes
- Gestion des profils
- Permissions granulaires
- Différents rôles utilisateur

### 🎓 Gestion des Étudiants
- Inscription des étudiants
- Gestion des programmes
- Suivi des performances
- Inscriptions aux entretiens

### 📅 Gestion des Entretiens
- Création et planification
- Différents types (Technique, RH, Final)
- Suivi des statuts
- Évaluation et notation
- Feedback détaillé

### 👥 Gestion des Comités
- Création de comités
- Attribution des membres
- Spécialisations
- Gestion des disponibilités

### 🏢 Gestion des Entreprises
- Enregistrement des entreprises
- Informations détaillées
- Gestion des partenariats
- Suivi des collaborations

### 📊 Tableau de Bord
- Statistiques en temps réel
- Graphiques de performance
- Entretiens récents
- Actions rapides

## 🧪 Tests

### Backend
```bash
# Dans chaque service
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Build de Production

### Backend
```bash
# Chaque service est prêt pour la production
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

## 🔍 Débogage

### Backend
- Logs détaillés dans la console
- Endpoints de santé : `/health`
- Documentation API dans chaque service

### Frontend
- React Developer Tools
- Console navigateur
- Network inspection
- Hot reload en développement

## 🚀 Déploiement

### Backend
Chaque service peut être déployé indépendamment :
- **Docker** : Images disponibles
- **Heroku** : Configuration incluse
- **AWS/GCP** : Compatible

### Frontend
- **Netlify** : Déploiement automatique
- **Vercel** : Optimisé pour React
- **AWS S3** : Hébergement statique

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📝 Notes de Développement

### Backend
- Architecture microservices
- Base de données séparée par service
- Communication inter-services via HTTP
- Authentification centralisée

### Frontend
- Architecture modulaire
- TypeScript strict
- Design system cohérent
- Responsive design

## 🐛 Problèmes Courants

### Backend
- **Port déjà utilisé** : Vérifier qu'aucun autre service n'utilise les ports
- **Base de données** : S'assurer que PostgreSQL est démarré
- **CORS** : Vérifier la configuration des origines autorisées

### Frontend
- **Dépendances** : Supprimer `node_modules` et réinstaller
- **Proxy** : Vérifier la configuration dans `package.json`
- **Build** : Nettoyer le cache avec `npm run build --force`

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
1. Consulter la documentation dans chaque dossier
2. Vérifier les logs de console
3. Ouvrir une issue sur GitHub

---

**Développé avec ❤️ pour simplifier la gestion des entretiens**