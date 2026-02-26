const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('vibely', 'root', '#@career28', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
})

module.exports = sequelize
