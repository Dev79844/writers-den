const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please enter the name'],
        unique: true
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        validate: validator.isEmail,
        unique:true
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
    if(!this.modifiedPaths('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isValidatedPassword = async function (userPassword){
    return await bcrypt.compare(userPassword, this.password)
}

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

userSchema.methods.isFollowing = function (id) {
    const idStr = id.toString();
    for (let followingUser of this.followingUsers) {
        if (followingUser.toString() === idStr) {
            return true;
        }
    }
    return false;
}

userSchema.methods.toProfileJSON = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: user ? user.isFollowing(this._id) : false
    }
};

userSchema.methods.follow = function(id){
    if(this.followingUsers.indexOf(id) === -1){
        this.followingUsers.push(id)
    }
    return this.save()
}

userSchema.methods.unfollow = function(id){
    if(this.followingUsers.indexOf(id) !== -1){
        this.followingUsers.remove(id)
    }
    return this.save()
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
    return this.save()
}

userSchema.methods.unfavourite = function(id){
    if(this.favouriteArticles.indexOf(id) !== -1){
        this.favouriteArticles.remove(id)
    }
    return this.save()
}

module.exports = mongoose.model('User',userSchema)