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
    await queryInterface.addColumn('wallet_transactions', 'client_account_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: {
          tableName: 'user_account',
        },
        key: 'id',
      },
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('wallet_transactions', 'client_account_id');
  }
};
