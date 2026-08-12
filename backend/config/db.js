const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim()
  const placeholder = 'your_mongodb_connection_string'

  if (!uri || uri === placeholder) {
    console.warn(
      'MONGODB_URI is not configured or is using the placeholder value.'
      + ' Starting mongodb-memory-server for local development.',
    )

    try {
      const mongoServer = await MongoMemoryServer.create()
      const memoryUri = mongoServer.getUri()
      mongoose.set('strictQuery', false)
      const connection = await mongoose.connect(memoryUri)
      console.log(`MongoDB in-memory server started: ${connection.connection.host}`)
      return
    } catch (error) {
      console.error('MongoDB in-memory server error:', error.message)
      process.exit(1)
    }
  }

  try {
    mongoose.set('strictQuery', false)
    const connection = await mongoose.connect(uri)
    console.log(`MongoDB connected: ${connection.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
