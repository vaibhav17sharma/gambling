'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('coupons', 'image', {
      type: Sequelize.BLOB,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.removeColumn('coupons', 'image');
  }
};
