'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_wallet', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      avl_amount : {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_wallet');
  }
};