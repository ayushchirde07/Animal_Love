/**
 * seed-ngo.js — creates the authorised NGO account
 * Run: node seed-ngo.js  (from the backend/ directory)
 */
const bcrypt = require('bcryptjs')
const path = require('path')

// Bootstrap the DB the same way the app does
const { sequelize } = require('./config/db')
const { User } = require('./models')

async function seed() {
  await sequelize.sync()

  const email = 'ayush@nagpur.ngo.in'
  const existing = await User.findOne({ where: { email } })

  if (existing) {
    console.log(`✔  NGO account already exists (id=${existing.id}). No changes made.`)
    process.exit(0)
  }

  const hashedPassword = await bcrypt.hash('ayush', 10)

  const user = await User.create({
    fullName: 'Ayush Chirde',
    email,
    mobile: '',
    city: 'Nagpur',
    password: hashedPassword,
    role: 'NGO',
  })

  console.log(`✅  NGO account created!`)
  console.log(`    Email   : ${user.email}`)
  console.log(`    Password: ayush`)
  console.log(`    Role    : ${user.role}`)
  console.log(`    ID      : ${user.id}`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
