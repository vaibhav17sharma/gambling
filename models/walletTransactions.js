'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const UserWallet = require('./userWallet');
class WalletTransactions extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

WalletTransactions.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  transaction_amount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    allowNull: false,
  },
  utr_no : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_wallet_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: UserWallet,
      key: 'id',
    },
    onUpdate: 'CASCADE'
  },
  admin_wallets_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: {
        tableName: 'admin_wallets',
        // schema: 'schema',
      },
      key: 'id',
    },
    onUpdate: 'CASCADE'
  },
  client_account_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: {
        tableName: 'user_account',
        // schema: 'schema',
      },
      key: 'id',
    },
    onUpdate: 'CASCADE'
  },
  deleted_at : {
    type : DataTypes.DATE,
    defaultValue : null,
  },
  type: {
    type: DataTypes.ENUM('debit', 'credit'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status : {
    type : DataTypes.ENUM('pending', 'approved'),
    allowNull : false,
  },
  transaction_purpose : {
    type: DataTypes.ENUM('wallet_topup', 'coupon_purchase', 'spin_reward'),
    allowNull: false,
  },
  created_by_admin: {
    type: DataTypes.BIGINT,
    allowNull: true,
    // references: {
    //   model: {
    //     tableName: 'admin_wallets',
    //   },
    //   key: 'id',
    // },
    // onUpdate: 'CASCADE'
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'WalletTransactions',
  tableName: 'wallet_transactions', // Optional: explicitly set table name
  underscored: true,
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  paranoid: true,   // Enables soft delete by using `deletedAt`
});

module.exports = WalletTransactions;