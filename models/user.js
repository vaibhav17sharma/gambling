'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    is_active : DataTypes.Boolean,
  }, {
    sequelize,
    modelName: 'User',
    underscored: true, // This changes 'createdAt' to 'created_at' and 'updatedAt' to 'updated_at'
    timestamps: true,  // Ensures created_at and updated_at columns are added
  });
  return User;
};