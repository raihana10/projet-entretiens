'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Companies', [
      {
        name: 'TechCorp Solutions',
        description: 'Entreprise leader dans le développement de solutions technologiques innovantes',
        industry: 'Technologie',
        size: 'large',
        website: 'https://techcorp-solutions.com',
        email: 'contact@techcorp-solutions.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Avenue des Champs-Élysées',
        city: 'Paris',
        country: 'France',
        postalCode: '75008',
        status: 'active',
        foundedYear: 2010,
        employeeCount: 500,
        revenue: '50M-100M EUR',
        logo: 'https://example.com/techcorp-logo.png',
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'StartupInnov',
        description: 'Startup innovante spécialisée dans l\'intelligence artificielle',
        industry: 'Intelligence Artificielle',
        size: 'startup',
        website: 'https://startupinnov.ai',
        email: 'hello@startupinnov.ai',
        phone: '+33 1 98 76 54 32',
        address: '456 Rue de la Innovation',
        city: 'Lyon',
        country: 'France',
        postalCode: '69001',
        status: 'active',
        foundedYear: 2022,
        employeeCount: 25,
        revenue: '1M-5M EUR',
        logo: 'https://example.com/startupinnov-logo.png',
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'DigitalServices Pro',
        description: 'Agence de services numériques pour PME et grandes entreprises',
        industry: 'Services Numériques',
        size: 'medium',
        website: 'https://digitalservices-pro.fr',
        email: 'info@digitalservices-pro.fr',
        phone: '+33 4 56 78 90 12',
        address: '789 Boulevard du Digital',
        city: 'Marseille',
        country: 'France',
        postalCode: '13001',
        status: 'active',
        foundedYear: 2015,
        employeeCount: 150,
        revenue: '10M-25M EUR',
        logo: 'https://example.com/digitalservices-logo.png',
        ownerId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Companies', null, {});
  }
}; 