const { Sequelize } = require('sequelize')
const path = require('path')

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

let sequelize

if (databaseUrl && databaseUrl.trim() !== '') {
  // Cloud PostgreSQL connection (Vercel Postgres, Supabase, Neon, Railway, AWS RDS, etc.)
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  })
} else {
  // Local development SQLite fallback
  const sqliteStorage = process.env.VERCEL
    ? path.join('/tmp', 'database.sqlite')
    : path.join(__dirname, '..', 'database.sqlite')

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqliteStorage,
    logging: false,
  })
}

let isInitialized = false

const connectDB = async () => {
  if (isInitialized) return sequelize

  try {
    await sequelize.authenticate()
    console.log(`SQL Database connected (${sequelize.getDialect()})`)

    // Require and setup models & associations
    require('../models')

    // Synchronize models with the database
    await sequelize.sync({ alter: true })
    isInitialized = true
    console.log('SQL Database models synchronized successfully')
    return sequelize
  } catch (error) {
    console.error('SQL Database connection error:', error.message)
    return null
  }
}

connectDB.sequelize = sequelize
connectDB.connectDB = connectDB

module.exports = connectDB
