'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');


// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   User.init({
//     firstName: DataTypes.STRING,
//     lastName: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     is_active : DataTypes.Boolean,
//   }, {
//     sequelize,
//     modelName: 'User',
//     underscored: true, // This changes 'createdAt' to 'created_at' and 'updatedAt' to 'updated_at'
//     timestamps: true,  // Ensures created_at and updated_at columns are added
//   });
//   return User;
// };


class User extends Model {
  static classLevelMethod() {
    return 'foo';
  }
  instanceLevelMethod() {
    return 'bar';
  }
  getFullname() {
    return [this.firstname, this.lastname].join(' ');
  }
}

User.init(
  {
    // id : DataTypes.INTEGER,
    username: DataTypes.STRING ,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      values: ['client', 'admin']
    }
  },
  {
    sequelize,
    modelName: 'User',
    underscored: true, // This changes 'createdAt' to 'created_at' and 'updatedAt' to 'updated_at'
    timestamps: true,  // Ensures created_at and updated_at columns are added },
  }
);

module.exports = User;