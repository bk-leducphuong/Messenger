const { Sequelize } = require('sequelize');
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.development" });
}else {
  require("dotenv").config({ path: ".env.production" });
}

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: process.env.PG_HOST,
  dialect: 'postgres',
  port: process.env.PG_PORT,
  password: process.env.PG_PASSWORD,
});

sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL database using Sequelize'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;