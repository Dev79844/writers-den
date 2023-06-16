const express  = require('express')
require('dotenv').config()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('tiny'))
app.use(cookieParser())

const user = require('./routes/userRoutes')

app.use("/api",user)

module.exports = app