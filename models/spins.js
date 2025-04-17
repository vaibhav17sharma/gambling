'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Spins extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Spins.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_coupon_id: {
        type: DataTypes.BIGINT,
        allowNull : true,
        references : {
          model: {
            tableName: 'user_coupons',
            // schema: 'schema',
          },
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      prize_amount : {
        type : DataTypes.DOUBLE,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE
      },
      deleted_at : {
        type : DataTypes.DATE,
        defaultValue : null,
      },
}, {
  sequelize,
  modelName: 'Spins',
  tableName: 'spins', // Optional: explicitly set table name
  underscored: true,
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  paranoid: true,   // Enables soft delete by using `deletedAt`
});

module.exports = Spins;