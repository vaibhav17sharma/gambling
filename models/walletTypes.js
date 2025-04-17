'use strict';
const {
  Model
} = require('sequelize');

class walletTypes extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

walletTypes.init({
  name: DataTypes.STRING
}, {
  sequelize,
  modelName: 'WalletTypes',
  tableName: 'wallet_types', // Optional: explicitly set table name
  underscored: true,
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  paranoid: true,   // Enables soft delete by using `deletedAt`
});

return walletTypes;