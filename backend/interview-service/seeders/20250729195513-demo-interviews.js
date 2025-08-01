'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Interviews', [
      {
        title: 'Entretien technique - Développement Web',
        description: 'Entretien technique pour évaluer les compétences en développement web',
        date: new Date('2025-02-15T10:00:00Z'),
        duration: 90,
        status: 'scheduled',
        type: 'technical',
        studentId: 1,
        committeeId: 1,
        companyId: 1,
        location: 'Salle de réunion A',
        notes: 'Préparer des questions sur React et Node.js',
        score: null,
        feedback: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Entretien RH - Culture d\'entreprise',
        description: 'Entretien pour évaluer l\'adéquation culturelle',
        date: new Date('2025-02-16T14:00:00Z'),
        duration: 60,
        status: 'scheduled',
        type: 'hr',
        studentId: 1,
        committeeId: 2,
        companyId: 1,
        location: 'Bureau RH',
        notes: 'Questions sur les valeurs et la motivation',
        score: null,
        feedback: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Interviews', null, {});
  }
}; 