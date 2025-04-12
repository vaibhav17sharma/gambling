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
    await queryInterface.createTable('wallet_transactions', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      transaction_amount : {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        allowNull: false,
      },
      user_wallet_id: {
        type: Sequelize.BIGINT,
        allowNull : true,
        references : {
          model: {
            tableName: 'user_wallet',
            // schema: 'schema',
          },
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      admin_wallets_id: {
        type: Sequelize.BIGINT,
        allowNull : true,
        references : {
          model: {
            tableName: 'admin_wallets',
            // schema: 'schema',
          },
          key: 'id',
        },
        onUpdate: 'CASCADE'
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
    await queryInterface.dropTable('wallet_transactions');
  }
};
