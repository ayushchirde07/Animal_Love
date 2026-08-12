const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')
const fs = require('fs')
const path = require('path')
const { Server } = require('socket.io')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const reportRoutes = require('./routes/reportRoutes')
const userRoutes = require('./routes/userRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(uploadsDir))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/analytics', analyticsRoutes)

// simple health endpoint for analytics
app.get('/api/analytics/health', (req, res) => res.json({ ok: true }))

app.get('/', (req, res) => {
  res.send({ status: 'success', message: 'Animal Guardian API is running' })
})

const startServer = async () => {
  await connectDB()

  // create HTTP server so Socket.IO can attach
  const server = http.createServer(app)

  // initialize Socket.IO with CORS allowed for local dev
  const io = new Server(server, {
    cors: { origin: '*' },
  })

  // attach io to the express app so controllers may access it via req.app
  app.set('io', io)

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)
    socket.on('disconnect', () => console.log('Socket disconnected:', socket.id))
  })

  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
}

startServer()
