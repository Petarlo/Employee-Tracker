const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_Name,
  process.env.DB_User,
  process.env.DB_Password,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  }
);

module.exports = sequelize;