const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-super-secret-jwt-key-for-student-service';

// Générer des tokens de test pour différents rôles
const generateTestTokens = () => {
  const tokens = {
    student: jwt.sign(
      { userId: 1, role: 'student', status: 'active' },
      JWT_SECRET,
      { expiresIn: '24h' }
    ),
    organizer: jwt.sign(
      { userId: 2, role: 'organizer', status: 'active' },
      JWT_SECRET,
      { expiresIn: '24h' }
    ),
    committee: jwt.sign(
      { userId: 3, role: 'committee', status: 'active' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
  };

  console.log('=== TOKENS DE TEST POUR POSTMAN ===\n');
  console.log('Token Student:');
  console.log(tokens.student);
  console.log('\nToken Organizer:');
  console.log(tokens.organizer);
  console.log('\nToken Committee:');
  console.log(tokens.committee);
  console.log('\n=== UTILISATION ===');
  console.log('Dans Postman, ajoutez le header:');
  console.log('Authorization: Bearer [TOKEN_CI_DESSUS]');
};

generateTestTokens(); 