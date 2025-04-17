'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Coupons extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Coupons.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  spin_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  min_prize_amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  max_prize_amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  coupon_name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  updated_at: {
    allowNull: true,
    type: DataTypes.DATE
  },
  deleted_at: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
}, {
  sequelize,
  modelName: 'Coupons',
  tableName: 'coupons', // Optional: explicitly set table name
  underscored: true,
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  paranoid: true,   // Enables soft delete by using `deletedAt`
});

module.exports = Coupons;