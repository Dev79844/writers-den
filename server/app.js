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
const articles = require('./routes/articleRoutes')

app.use("/api",user)
app.use("/api/articles",articles)

module.exports = app