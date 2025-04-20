'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

      await queryInterface.bulkInsert('coupons', [
        {
          coupon_name: 'BRONZE',
          price: 10,
          spin_days: 1,
          min_prize_amount: 0,
          max_prize_amount: 100,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          coupon_name: 'SILVER',
          price: 20,
          spin_days: 2,
          min_prize_amount: 0,
          max_prize_amount: 200,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          coupon_name: 'GOLD',
          price: 30,
          spin_days: 3,
          min_prize_amount: 0,
          max_prize_amount: 300,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('coupons', null, {});
  }
};
