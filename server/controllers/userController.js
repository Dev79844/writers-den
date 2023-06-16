const cookieToken = require('../utils/cookieToken')
const User = require('../models/user')

exports.login = async(req,res,next) => {
    try {
        const {email,password} = req.body 
        
        if(!email || !password){
            return next(new Error("Please enter all fields"))
        }

        const user = await User.findOne({email})
        if(!user){
            return next(new Error("User does not exist"))
        }

        const isValidPassword = user.isValidatedPassword(password)

        if(!isValidPassword){
            return next(new Error("Email or password incorrect!"))
        }

        cookieToken(user,res)

    } catch (error) {
        throw error
    }
}

exports.register = async(req,res) => {
    try {
        const {username,email,password} = req.body 

        if(!username || !email || !password){
            return next(new Error("Please enter username,email and password"))
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return next(new Error("User already exists"))
        }


        const user = await User.create({
            username,
            email,
            password
        })

        user.password = undefined

        cookieToken(user,res)

    } catch (error) {
        throw error
    }
}

exports.getUser = async(req,res,next) => {
    try {
        res.status(200).json({
            user:{
                email: req.user.email,
                username: req.user.username,
                bio: req.user.bio,
            }
        })
    } catch (error) {
        throw error
    }
}

exports.updateUser = async(req,res,next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {new: true})
        res.status(200).json({
            user:{
                email: updatedUser.email,
                bio: updatedUser.bio
            }
        })
    } catch (error) {
        throw error
    }
}

exports.getProfile = async(req,res,next) => {
    try {
        const profile = await User.findOne({username: req.params.username})
        res.status(200).json({
            profile:{
                username: profile.username,
                bio: profile.bio,
                following: req.user.isFollowing(profile._id)
            }
        })
    } catch (error) {
        throw error
    }
}

exports.followUser = async(req,res,next) => {
    try {
        const profile = await User.findOne({username: req.params.username})
        const user = await User.findOne({_id: req.user._id})
        await user.follow(profile._id)

        res.status(200).json({
            profile:{
                username: profile.username,
                bio: profile.bio,
                following: user.isFollowing(profile._id)
            }
        })
    } catch (error) {
        throw error
    }
}

exports.unfollowUser = async(req,res,next) => {
    try {
        const profile = await User.findOne({username: req.params.username})
        const user = await User.findOne({_id: req.user._id})
        await user.unfollow(profile._id)

        res.status(200).json({
            profile:{
                username: profile.username,
                bio: profile.bio,
                following: user.isFollowing(profile._id)
            }
        })
    } catch (error) {
        throw error
    }
}