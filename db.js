const Sequelize = require('sequelize')

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './schedule.sql',
  define: {
    // `createdAt` and `updatedAt` fields will not be created
    timestamps: false,
  },
})

database
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = {
  Sequelize: Sequelize,
  database: database,
}
