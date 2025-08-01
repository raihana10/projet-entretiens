'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StudentRegistration extends Model {
    static associate(models) {
      // define associations here
    }
  }

  StudentRegistration.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    opportunityType: {
      type: DataTypes.ENUM('PFA', 'PFE', 'stage_observation', 'emploi'),
      allowNull: false
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estimatedTime: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'StudentRegistration',
    tableName: 'StudentRegistrations',
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'companyId']
      },
      {
        fields: ['companyId', 'status']
      },
      {
        fields: ['studentId']
      }
    ]
  });

  return StudentRegistration;
}; 