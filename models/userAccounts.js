'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class UserAccounts extends Model {

    static associate(models) {
        // define association here
    }
}

UserAccounts.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: {
                tableName: 'users',
                // schema: 'schema',
            },
            key: 'id',
        },
        onUpdate: 'CASCADE'
    },

    account_number: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
    },
    bank_name: {
        type: DataTypes.STRING,
        defaultValue: 0,
        allowNull: false,
    },

    ifsc_code: {
        type: DataTypes.STRING,
        defaultValue: 0,
        allowNull: true,
    },
    created_at: {
        allowNull: true,
        type: DataTypes.DATE,
    },
    updated_at: {
        allowNull: true,
        type: DataTypes.DATE
    },
    deleted_at: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
}, {
    sequelize,
    modelName: 'UserAccounts',
    tableName: 'user_account', // Optional: explicitly set table name
    underscored: true,
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    paranoid: true,   // Enables soft delete by using `deletedAt`
});

module.exports = UserAccounts;