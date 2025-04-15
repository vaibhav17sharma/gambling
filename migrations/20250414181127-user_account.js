'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable('user_account', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.BIGINT,
        allowNull : true,
        references : {
          model: {
            tableName: 'users',
            // schema: 'schema',
          },
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },

      account_number : {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        allowNull: false,
      },
      bank_name : {
        type: Sequelize.STRING,
        defaultValue: 0,
        allowNull: false,
      },
     
      ifsc_code: {
        type: Sequelize.STRING,
        defaultValue: 0,
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
    await queryInterface.dropTable('user_account');
  }
};
