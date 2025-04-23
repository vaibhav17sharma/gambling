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
   await queryInterface.bulkInsert('admin_wallets', [
      {
        max_trxn_amount: 10000.0,
        ttl_txn_amount: 1000.0,
        account_number: 987654321,
        qr_image: null,
        upi_id: "abcd@paytm",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      },
      {
        max_trxn_amount: 15000.0,
        ttl_txn_amount: 1000.0,
        account_number: 987654391,
        qr_image: null,
        upi_id: "efgh@paytm",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
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
    await queryInterface.bulkDelete('admin_wallets', null, {});
  }
};
