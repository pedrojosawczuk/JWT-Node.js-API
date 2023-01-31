const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')

backendVersion = '/api/v1'

// Import Routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

// Connect to DB
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_CONNECT, () => console.log('[server] Connected to db!'))

// Middleware
app.use(express.json())

// Route Middlewares
app.use(backendVersion, authRoute)
app.use(backendVersion + '/posts', postRoute)

app.listen(3000, () => {
    console.log('[server] Server Up and running')
})