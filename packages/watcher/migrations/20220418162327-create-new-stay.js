'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NewStays', {
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
      guest_count: {
        type: Sequelize.NUMBER
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
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
      .then(() => queryInterface.addIndex('NewStays', ['status']))
      .then(() => queryInterface.addIndex('NewStays', ['token_id']))
    ;
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NewStays');
  }
};
