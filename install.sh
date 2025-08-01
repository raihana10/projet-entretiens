#!/bin/bash

echo "🚀 Installation du Système de Gestion des Entretiens"
echo "=================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js v16 ou supérieur."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm."
    exit 1
fi

echo "✅ Node.js et npm sont installés"

# Installer les dépendances pour chaque service
echo "📦 Installation des dépendances..."

# User Service
echo "Installing user-service dependencies..."
cd backend/user-service
npm install
cd ../..

# Student Service
echo "Installing student-service dependencies..."
cd backend/student-service
npm install
cd ../..

# Company Service
echo "Installing company-service dependencies..."
cd backend/company-service
npm install
cd ../..

# Committee Service
echo "Installing committee-service dependencies..."
cd backend/committee-service
npm install
cd ../..

# Interview Service
echo "Installing interview-service dependencies..."
cd backend/interview-service
npm install
cd ../..

echo "✅ Toutes les dépendances sont installées"

# Créer les fichiers .env
echo "🔧 Configuration des variables d'environnement..."

# User Service .env
cat > backend/user-service/.env << EOF
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=user_service_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
EOF

# Student Service .env
cat > backend/student-service/.env << EOF
PORT=3002
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=student_service_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
EOF

# Company Service .env
cat > backend/company-service/.env << EOF
PORT=3003
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/company_service
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
EOF

# Committee Service .env
cat > backend/committee-service/.env << EOF
PORT=3004
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/committee_service
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
EOF

# Interview Service .env
cat > backend/interview-service/.env << EOF
PORT=3005
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/interview_service
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
EOF

echo "✅ Fichiers .env créés"

# Instructions pour les bases de données
echo ""
echo "📊 Configuration des bases de données"
echo "===================================="
echo ""
echo "1. MySQL (pour user-service et student-service):"
echo "   - Assurez-vous que MySQL est démarré"
echo "   - Créez les bases de données:"
echo "     CREATE DATABASE user_service_db;"
echo "     CREATE DATABASE student_service_db;"
echo ""
echo "2. MongoDB (pour les autres services):"
echo "   - Assurez-vous que MongoDB est démarré"
echo "   - Les bases de données seront créées automatiquement"
echo ""

# Script de démarrage
cat > start-services.sh << 'EOF'
#!/bin/bash

echo "🚀 Démarrage des services..."

# Démarrer user-service
echo "Starting user-service on port 3001..."
cd backend/user-service
npm run dev &
USER_PID=$!

# Démarrer student-service
echo "Starting student-service on port 3002..."
cd ../student-service
npm run dev &
STUDENT_PID=$!

# Démarrer company-service
echo "Starting company-service on port 3003..."
cd ../company-service
npm run dev &
COMPANY_PID=$!

# Démarrer committee-service
echo "Starting committee-service on port 3004..."
cd ../committee-service
npm run dev &
COMMITTEE_PID=$!

# Démarrer interview-service
echo "Starting interview-service on port 3005..."
cd ../interview-service
npm run dev &
INTERVIEW_PID=$!

echo "✅ Tous les services sont démarrés"
echo ""
echo "Services disponibles:"
echo "- User Service: http://localhost:3001"
echo "- Student Service: http://localhost:3002"
echo "- Company Service: http://localhost:3003"
echo "- Committee Service: http://localhost:3004"
echo "- Interview Service: http://localhost:3005"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services"

# Fonction pour arrêter tous les services
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    kill $USER_PID $STUDENT_PID $COMPANY_PID $COMMITTEE_PID $INTERVIEW_PID
    exit 0
}

trap cleanup SIGINT

# Attendre que tous les processus se terminent
wait
EOF

chmod +x start-services.sh

echo "✅ Script de démarrage créé: start-services.sh"
echo ""
echo "🎉 Installation terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurez vos bases de données (MySQL et MongoDB)"
echo "2. Exécutez les migrations:"
echo "   cd backend/user-service && npm run db:migrate"
echo "   cd ../student-service && npm run db:migrate"
echo "3. Démarrez les services: ./start-services.sh"
echo ""
echo "📚 Consultez le README.md pour plus d'informations" 