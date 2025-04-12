'use strict';
const {
  Model,
  DOUBLE
} = require('sequelize');

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
  transaction_amount : {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    allowNull: false,
  },
  wallet_id: {
    type: DataTypes.BIGINT,
  },
  deleted_at : {
    type : DataTypes.Date,
  },
  created_at: {
    type: Sequelize.DATE
  },
  updated_at: {
    type: Sequelize.DATE
  }
}, {
  sequelize,
  modelName: 'WalletTransactions',
  tableName: 'wallet_transactions', // Optional: explicitly set table name
  underscored: true,
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  paranoid: true,   // Enables soft delete by using `deletedAt`
});