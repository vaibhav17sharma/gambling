'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const tableDescription = await queryInterface.describeTable('users');
    if (!tableDescription.role) {
      await queryInterface.addColumn('users', 'role', {
        type: Sequelize.ENUM('client', 'admin'),
        allowNull: false,
        defaultValue: 'client'
      });
    }
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'role');
  }
};
