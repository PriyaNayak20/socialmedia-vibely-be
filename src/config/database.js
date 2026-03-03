const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.db, process.env.db_user, process.env.db_password, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
})

module.exports = sequelize
