'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

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
      price : {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      spin_days : {
        type : DataTypes.INTEGER,
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
  modelName: 'Coupons',
  tableName: 'coupons', // Optional: explicitly set table name
  underscored: true,
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  paranoid: true,   // Enables soft delete by using `deletedAt`
});

module.exports = Coupons;