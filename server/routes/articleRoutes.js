const express = require('express')
const {isLoggedIn} = require('../middlewares/user')
const {createArticle,getArticleBySlug,updateArticle,deleteArticle} = require('../controllers/articleControllers')

const router = express.Router()

router.post("/",isLoggedIn,createArticle)
router.get("/:slug",getArticleBySlug)
router.put("/:slug",isLoggedIn,updateArticle)
router.delete("/:slug",isLoggedIn,deleteArticle)

module.exports = router