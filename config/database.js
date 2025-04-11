const { Sequelize } = require('sequelize');
const dbName = env('DB_NAME');
const username = env('DB_USER');
const password = env('DB_PASSWORD');
const host = env('DB_HOST');
const protocol = env('DB_PROTOCOL');
 
const sequelize = new Sequelize(dbName, username, password, {
    host: host,
    dialect: protocol,
});
  
sequelize.authenticate()
    .then(() => console.log('Database connected successfully'))
    .catch((error) => console.error('Database connection error:', error));
  
module.exports = sequelize;
  