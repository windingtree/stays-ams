'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stays', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      facility_id: {
        type: Sequelize.STRING
      },
      space_id: {
        type: Sequelize.STRING
      },
      token_id: {
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        index: '',
      },
      quantity: {
        type: Sequelize.NUMBER
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      data: {
        type: Sequelize.JSON
      },
      status: {
        allowNull: false,
        type: Sequelize.NUMBER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
      .then(() => queryInterface.addIndex('Stays', ['status']))
      .then(() => queryInterface.addIndex('Stays', ['token_id']))
    ;
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stays');
  }
};
