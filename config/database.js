const { Sequelize } = require('sequelize');
const dbName = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const protocol = process.env.DB_PROTOCOL;

const sequelize = new Sequelize(dbName, username, password, {
    host: host,
    dialect: protocol,
    // timezone: '+00:00',
    timezone: '+05:30', // or 'Asia/Kolkata'
    pool: {
        max: 10,         // max connections in pool
        min: 0,          // min connections in pool
        acquire: 30000,  // max time (ms) pool will try to get connection before throwing error
        idle: 10000      // max time (ms) a connection can be idle before being released
      },
});


module.exports = sequelize;
