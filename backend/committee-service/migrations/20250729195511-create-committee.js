'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Committees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('technical', 'hr', 'academic', 'mixed'),
        allowNull: false,
        defaultValue: 'mixed'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'archived'),
        allowNull: false,
        defaultValue: 'active'
      },
      maxMembers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      },
      currentMembers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      chairpersonId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true
      },
      specialization: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Ajouter des index pour améliorer les performances
    await queryInterface.addIndex('Committees', ['status']);
    await queryInterface.addIndex('Committees', ['type']);
    await queryInterface.addIndex('Committees', ['chairpersonId']);
    await queryInterface.addIndex('Committees', ['department']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Committees');
  }
}; 