const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please enter the name']
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        validate: validator.isEmail
    },
    password:{
        type:String,
        required:[true,'Please enter your password']
    },
    followingUsers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    favouriteArticles:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Article'
        }
    ],
    bio:{
        type:String,
        default:""
    }
},{timestamps:true})

userSchema.pre('save', async function(next){
    if(!this.modifiedPaths(this.password)) return next()
    this.password = bcrypt.hash(this.password, 10)
})

userSchema.methods.isValidatedPassword() = async function (userPassword){
    return await bcrypt.compare(userPassword, this.password)
}

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

userSchema.methods.isFollowing = async function(id){
    const idStr = id.toString()
    for(const followingUser of this.followingUsers){
        if(followingUser.toString() === idStr){
            return true
        }
    }
    return false
}

userSchema.methods.follow = function(id){
    if(this.followingUsers.indexOf(id) === -1){
        this.followingUsers.push(id)
    }
}

userSchema.methods.unfollow = function(id){
    if(this.followingUsers.indexOf(id) !== -1){
        this.followingUsers.remove(id)
    }
}

userSchema.methods.isFavourite = function(id){
    for(const article of this.favouriteArticles){
        if(article.toString() === id.toString()){
            return true
        }
    }
    return false
}

userSchema.methods.favourite = function(id){
    if(this.favouriteArticles.indexOf(id) === -1){
        this.favouriteArticles.push(id)
    }
}

userSchema.methods.unfavourite = function(id){
    if(this.favouriteArticles.indexOf(id) !== -1){
        this.favouriteArticles.remove(id)
    }
}

module.exports = mongoose.model('User',userSchema)