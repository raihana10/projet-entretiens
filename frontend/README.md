# Interview Manager - Frontend

Application React moderne pour la gestion des entretiens d'embauche et d'évaluation.

## 🚀 Technologies Utilisées

- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **React Query** pour la gestion d'état serveur
- **React Hook Form** avec Yup pour la validation
- **Lucide React** pour les icônes
- **React Hot Toast** pour les notifications
- **Axios** pour les requêtes HTTP

## 📦 Installation

1. **Installer les dépendances :**
```bash
npm install
```

2. **Démarrer l'application en mode développement :**
```bash
npm start
```

L'application sera accessible à l'adresse : http://localhost:3000

## 🏗️ Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   └── Layout/         # Composants de mise en page
├── contexts/           # Contextes React (Auth, etc.)
├── hooks/              # Hooks personnalisés
├── pages/              # Pages de l'application
├── services/           # Services API
├── types/              # Types TypeScript
├── utils/              # Utilitaires
├── App.tsx             # Composant principal
├── index.tsx           # Point d'entrée
└── index.css           # Styles globaux
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
REACT_APP_API_URL=http://localhost:3001
```

### Proxy

L'application est configurée pour rediriger les requêtes API vers le backend via le proxy dans `package.json`.

## 🎨 Design System

### Couleurs

- **Primary** : Bleu (#2563eb)
- **Success** : Vert (#22c55e)
- **Warning** : Orange (#f59e0b)
- **Danger** : Rouge (#ef4444)
- **Secondary** : Gris (#64748b)

### Composants

- **Boutons** : `.btn`, `.btn-primary`, `.btn-secondary`, etc.
- **Inputs** : `.input`, `.input-error`
- **Cards** : `.card`, `.card-header`, `.card-body`
- **Badges** : `.badge`, `.badge-success`, `.badge-warning`, etc.

## 🔐 Authentification

L'application utilise un système d'authentification JWT avec :

- **Connexion** : `/login`
- **Protection des routes** : Routes protégées automatiquement
- **Gestion des tokens** : Stockage local et interceptions Axios
- **Déconnexion automatique** : En cas d'expiration du token

## 📱 Responsive Design

L'application est entièrement responsive avec :
- **Mobile First** : Design optimisé pour mobile
- **Breakpoints** : sm, md, lg, xl
- **Navigation mobile** : Menu hamburger
- **Tableaux adaptatifs** : Scroll horizontal sur mobile

## 🚀 Scripts Disponibles

```bash
# Développement
npm start

# Build de production
npm run build

# Tests
npm test

# Eject (non recommandé)
npm run eject
```

## 🔗 Intégration avec le Backend

L'application communique avec les services backend suivants :

- **User Service** (Port 3001) : Authentification et gestion des utilisateurs
- **Student Service** (Port 3002) : Gestion des étudiants
- **Interview Service** (Port 3003) : Gestion des entretiens
- **Committee Service** (Port 3004) : Gestion des comités
- **Company Service** (Port 3005) : Gestion des entreprises

## 📊 Fonctionnalités

### Tableau de Bord
- Statistiques en temps réel
- Entretiens récents
- Actions rapides
- Graphiques de performance

### Gestion des Entretiens
- Création et modification
- Planification
- Suivi des statuts
- Évaluation et notation

### Gestion des Utilisateurs
- Différents rôles (Admin, Étudiant, Comité, Entreprise)
- Permissions granulaires
- Profils personnalisés

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests en mode watch
npm test -- --watch

# Tests avec couverture
npm test -- --coverage
```

## 📦 Build de Production

```bash
# Créer le build de production
npm run build

# Le build sera créé dans le dossier `build/`
```

## 🔧 Développement

### Ajouter une nouvelle page

1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `src/App.tsx`
3. Ajouter le lien dans la navigation si nécessaire

### Ajouter un nouveau service API

1. Créer le service dans `src/services/`
2. Ajouter les types dans `src/types/`
3. Utiliser React Query pour la gestion d'état

### Styling

- Utiliser Tailwind CSS pour le styling
- Créer des classes personnalisées dans `src/index.css`
- Suivre le design system établi

## 🐛 Débogage

- **React Developer Tools** : Extension navigateur recommandée
- **Console** : Logs détaillés en mode développement
- **Network** : Inspection des requêtes API
- **Redux DevTools** : Si utilisé pour la gestion d'état

## 📝 Notes de Développement

- **TypeScript strict** : Tous les types doivent être définis
- **ESLint** : Règles de code strictes
- **Prettier** : Formatage automatique
- **Husky** : Hooks Git pour la qualité du code

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 