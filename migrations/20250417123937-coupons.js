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

    await queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      coupon_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price : {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        allowNull: false,
      },
      spin_days : {
        type : Sequelize.INTEGER,
        allowNull: false,
      },
      min_prize_amount : {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        allowNull: false,
      },
      max_prize_amount : {
        type: Sequelize.DOUBLE,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('coupons');
  }
};
