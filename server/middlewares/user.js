const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.isLoggedIn = async(req,res,next) => {
    try {
        const token = req.cookies.token || req.headers['Authorization'].replace("Bearer ","")

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id)

        next()

    } catch (error) {
        throw error
    }
}