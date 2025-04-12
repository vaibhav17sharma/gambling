'use strict';
const {
  Model,
  DOUBLE
} = require('sequelize');

class UserWallet extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
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
    type : DataTypes.Date,
    defaultValue : null,
  },
  created_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updated_at: {
    allowNull: true,
    type: Sequelize.DATE
  }
}, {
  sequelize,
  modelName: 'UserWallet',
  tableName: 'user_wallets', // Optional: explicitly set table name
  underscored: true,
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  paranoid: true,   // Enables soft delete by using `deletedAt`
});