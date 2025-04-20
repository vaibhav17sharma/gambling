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
    await queryInterface.addColumn('wallet_transactions', 'transaction_purpose', {
      type: Sequelize.ENUM('wallet_topup', 'coupon_purchase', 'spin_reward'),
      allowNull: false,
      // defaultValue: 'other',
      after: 'status'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('wallet_transactions', 'transaction_purpose');
  }
};
