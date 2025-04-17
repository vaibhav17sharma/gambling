'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

class UserCoupons extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

UserCoupons.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull : true,
        references : {
          model: {
            tableName: 'users',
            // schema: 'schema',
          },
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      coupon_id: {
        type: DataTypes.BIGINT,
        allowNull : true,
        references : {
          model: {
            tableName: 'coupons',
            // schema: 'schema',
          },
          key: 'id',
        },
        onUpdate: 'CASCADE'
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
  modelName: 'UserCoupons',
  tableName: 'user_coupons', // Optional: explicitly set table name
  underscored: true,
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  paranoid: true,   // Enables soft delete by using `deletedAt`
});

return UserCoupons;