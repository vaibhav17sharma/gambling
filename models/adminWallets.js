'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class AdminWallets extends Model {
 
  static associate(models) {
    // define association here
  }
}

AdminWallets.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  account_number : {
    type: DataTypes.INTEGER,
  },
  qr_image: {
    type: DataTypes.BLOB,
  },
  max_trxn_amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  
  ttl_txn_amount: {
    type: DataTypes.DOUBLE,
    defaultValue:0,
    allowNull: false,
  },
  deleted_at : {
    type : DataTypes.DATE,
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'AdminWallets',
  tableName: 'admin_wallets', // Optional: explicitly set table name
  underscored: true,
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  paranoid: true,   // Enables soft delete by using `deletedAt`
});

module.exports = AdminWallets;