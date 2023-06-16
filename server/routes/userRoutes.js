const express = require('express')
const {isLoggedIn} = require('../middlewares/user')
const {login,register,getUser,updateUser,getProfile,followUser,unfollowUser} = require('../controllers/userController')

const router = express.Router()

router.post("/users/login",login)
router.post("/users", register)
router.route("/user").get(isLoggedIn,getUser).put(isLoggedIn,updateUser)
router.route("/profiles/:username").get(isLoggedIn,getProfile)
router.route("/profiles/:username/follow").post(isLoggedIn,followUser).delete(isLoggedIn,unfollowUser)

module.exports = router