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
    await queryInterface.createTable('admin_wallets', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      max_trxn_amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      ttl_txn_amount: {
        type: Sequelize.DOUBLE,
        defaultValue:0,
        allowNull: false,
      },
      account_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      qr_image: {
        type: Sequelize.BLOB,
        defaultValue: null,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deleted_at : {
        type : Sequelize.DATE,
        defaultValue : null,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('admin_wallets');
  }
};
