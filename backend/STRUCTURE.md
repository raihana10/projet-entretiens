# Structure des Services Backend

Ce document décrit la structure des services backend du projet d'entretiens.

## Services Disponibles

### 1. User Service (Port: 3001)
**Gestion des utilisateurs et authentification**

- **config/**: Configuration de la base de données et JWT
- **controllers/**: Contrôleurs pour l'authentification et la gestion des utilisateurs
- **middlewares/**: Middlewares d'authentification et d'autorisation
- **migrations/**: Migrations pour la table Users
- **models/**: Modèles Sequelize pour les utilisateurs
- **routes/**: Routes pour l'API utilisateurs

### 2. Student Service (Port: 3002)
**Gestion des étudiants et inscriptions**

- **config/**: Configuration de la base de données
- **controllers/**: Contrôleurs pour la gestion des étudiants
- **middlewares/**: Middlewares d'authentification
- **migrations/**: Migrations pour les tables Students et StudentRegistrations
- **models/**: Modèles Sequelize pour les étudiants
- **routes/**: Routes pour l'API étudiants

### 3. Interview Service (Port: 3003)
**Gestion des entretiens**

- **config/**: Configuration de la base de données
- **controllers/**: Contrôleurs pour la gestion des entretiens
- **middlewares/**: Middlewares d'authentification et autorisation
- **migrations/**: Migrations pour la table Interviews
- **models/**: Modèles Sequelize pour les entretiens
- **routes/**: Routes pour l'API entretiens
- **services/**: Services métier pour les entretiens
- **seeders/**: Données d'exemple pour les entretiens

### 4. Committee Service (Port: 3004)
**Gestion des comités d'entretien**

- **config/**: Configuration de la base de données
- **controllers/**: Contrôleurs pour la gestion des comités
- **middlewares/**: Middlewares d'authentification et autorisation
- **migrations/**: Migrations pour la table Committees
- **models/**: Modèles Sequelize pour les comités
- **routes/**: Routes pour l'API comités


### 5. Company Service (Port: 3005)
**Gestion des entreprises**

- **config/**: Configuration de la base de données
- **controllers/**: Contrôleurs pour la gestion des entreprises
- **middlewares/**: Middlewares d'authentification et autorisation
- **migrations/**: Migrations pour la table Companies
- **models/**: Modèles Sequelize pour les entreprises
- **routes/**: Routes pour l'API entreprises


## Structure Commune des Dossiers

Chaque service suit la même structure :

```
service-name/
├── config/
│   ├── config.js          # Configuration JavaScript
│   └── config.json        # Configuration Sequelize
├── controllers/
│   └── *.js               # Contrôleurs de l'API
├── middlewares/
│   └── auth.js            # Middlewares d'authentification
├── migrations/
│   └── *.js               # Migrations de base de données
├── models/
│   ├── index.js           # Configuration des modèles
│   └── *.js               # Modèles Sequelize
├── routes/
│   └── *.js               # Routes de l'API
├── seeders/               # Données d'exemple (optionnel)
│   └── *.js
├── .sequelizerc           # Configuration Sequelize
├── app.js                 # Point d'entrée de l'application
└── package.json           # Dépendances du service
```

## Configuration des Bases de Données

Chaque service a sa propre base de données :

- `user_service_dev` - Service utilisateurs
- `student_service_dev` - Service étudiants
- `interview_service_dev` - Service entretiens
- `committee_service_dev` - Service comités
- `company_service_dev` - Service entreprises

## Authentification

Tous les services utilisent JWT pour l'authentification avec :
- Secret configurable via variable d'environnement
- Expiration des tokens configurable
- Middlewares d'autorisation par rôle

## Migrations et Seeders

Pour exécuter les migrations :
```bash
cd service-name
npx sequelize-cli db:migrate
```

Pour exécuter les seeders :
```bash
cd service-name
npx sequelize-cli db:seed:all
```

## Démarrage des Services

Utilisez le script PowerShell fourni :
```powershell
.\start-services.ps1
```

Ou démarrez chaque service individuellement :
```bash
cd service-name
npm start
``` 