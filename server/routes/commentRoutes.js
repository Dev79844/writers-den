const express = require('express')
const {isLoggedIn} = require('../middlewares/user')
const {createComment,getCommentsForArticle,deleteComment} = require('../controllers/commentControllers')

const router = express.Router()

router.post("/:slug/comments",isLoggedIn,createComment)
router.get("/:slug/comments",getCommentsForArticle)
router.delete("/:slug/comments/:id",isLoggedIn,deleteComment)

module.exports = router