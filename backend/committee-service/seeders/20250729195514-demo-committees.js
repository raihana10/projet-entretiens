'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Committees', [
      {
        name: 'Comité Technique - Développement',
        description: 'Comité spécialisé dans l\'évaluation technique des candidats développeurs',
        type: 'technical',
        status: 'active',
        maxMembers: 5,
        currentMembers: 3,
        chairpersonId: 1,
        department: 'Informatique',
        specialization: 'Développement Web et Mobile',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Comité RH - Ressources Humaines',
        description: 'Comité chargé de l\'évaluation des compétences comportementales',
        type: 'hr',
        status: 'active',
        maxMembers: 4,
        currentMembers: 2,
        chairpersonId: 2,
        department: 'Ressources Humaines',
        specialization: 'Recrutement et Culture d\'entreprise',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Comité Académique - Formation',
        description: 'Comité pour l\'évaluation des compétences académiques',
        type: 'academic',
        status: 'active',
        maxMembers: 6,
        currentMembers: 4,
        chairpersonId: 3,
        department: 'Formation',
        specialization: 'Évaluation pédagogique',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Committees', null, {});
  }
}; 