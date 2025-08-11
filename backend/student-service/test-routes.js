const axios = require('axios');

const BASE_URL = 'http://localhost:3002';
const TOKENS = {
  student: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJzdHVkZW50Iiwic3RhdHVzIjoiYWN0aXZlIiwiaWF0IjoxNzU0ODU2ODcxLCJleHAiOjE3NTQ5NDMyNzF9.ttuOTxn6n46l7GYV7EeIlhKQ_hk82vErlg42umYQmrc',
  organizer: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJvcmdhbml6ZXIiLCJzdGF0dXMiOiJhY3RpdmUiLCJpYXQiOjE3NTQ4NTY4NzEsImV4cCI6MTc1NDk0MzI3MX0.Yc3wfd5-GCkzg5lD5WWQSnj_vYtLi9_j1kg6TC312Vs',
  committee: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJjb21taXR0ZWUiLCJzdGF0dXMiOiJhY3RpdmUiLCJpYXQiOjE3NTQ4NTY4NzEsImV4cCI6MTc1NDk0MzI3MX0.kr3VOVSLY-txvsjZgyfwNRNZjQsCqsVRYrD3nCEtnP0'
};

const testRoutes = async () => {
  console.log('=== TEST DES ROUTES DU SERVICE ÉTUDIANT ===\n');

  try {
    // Test 1: Route de santé (sans authentification)
    console.log('1. Test route de santé...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Route /health: ${healthResponse.status} - ${JSON.stringify(healthResponse.data)}`);

    // Test 2: Route protégée avec token organizer
    console.log('\n2. Test route protégée avec token organizer...');
    const studentsResponse = await axios.get(`${BASE_URL}/api/students`, {
      headers: { Authorization: `Bearer ${TOKENS.organizer}` }
    });
    console.log(`✅ Route /api/students: ${studentsResponse.status}`);

    // Test 3: Route protégée avec token committee
    console.log('\n3. Test route protégée avec token committee...');
    const registrationsResponse = await axios.get(`${BASE_URL}/api/registrations`, {
      headers: { Authorization: `Bearer ${TOKENS.committee}` }
    });
    console.log(`✅ Route /api/registrations: ${registrationsResponse.status}`);

    // Test 4: Route protégée avec token student
    console.log('\n4. Test route protégée avec token student...');
    const studentRegResponse = await axios.get(`${BASE_URL}/api/students/1`, {
      headers: { Authorization: `Bearer ${TOKENS.student}` }
    });
    console.log(`✅ Route /api/students/1: ${studentRegResponse.status}`);

    console.log('\n🎉 Toutes les routes fonctionnent correctement !');

  } catch (error) {
    if (error.response) {
      console.log(`❌ Erreur ${error.response.status}: ${error.response.data.error || error.response.statusText}`);
    } else {
      console.log(`❌ Erreur: ${error.message}`);
    }
  }
};

testRoutes(); 