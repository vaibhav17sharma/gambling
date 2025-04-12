'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class UserWallet extends Model {
 
  static associate(models) {
    // define association here
  }
}

UserWallet.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  avl_amount : {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull : true,
    references : {
      model : 'User',
      key : 'id'
    },
    onUpdate: 'CASCADE'
  },
  deleted_at : {
    type : DataTypes.DATE,
    defaultValue : null,
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updated_at: {
    allowNull: true,
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'UserWallet',
  tableName: 'user_wallet', // Optional: explicitly set table name
  underscored: true,
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  paranoid: true,   // Enables soft delete by using `deletedAt`
});

module.exports = UserWallet;