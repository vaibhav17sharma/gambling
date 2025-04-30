'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('wallet_transactions', 'transaction_purpose', {
      type: Sequelize.ENUM('wallet_topup', 'coupon_purchase', 'spin_reward', 'wallet_debit'),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('wallet_transactions', 'transaction_purpose', {
      type: Sequelize.ENUM('wallet_topup', 'coupon_purchase', 'spin_reward'),
      allowNull: false
    });
  }
};
