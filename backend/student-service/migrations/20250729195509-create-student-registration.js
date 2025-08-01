'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudentRegistrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Students',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      companyId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      opportunityType: {
        type: Sequelize.ENUM('PFA', 'PFE', 'stage_observation', 'emploi'),
        allowNull: false
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      estimatedTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 15
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      registrationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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

    // Add unique constraint
    await queryInterface.addConstraint('StudentRegistrations', {
      fields: ['studentId', 'companyId'],
      type: 'unique',
      name: 'unique_student_company_registration'
    });

    // Add indexes
    await queryInterface.addIndex('StudentRegistrations', ['companyId', 'status']);
    await queryInterface.addIndex('StudentRegistrations', ['studentId']);
    await queryInterface.addIndex('StudentRegistrations', ['opportunityType']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StudentRegistrations');
  }
}; 