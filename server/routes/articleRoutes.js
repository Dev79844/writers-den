const express = require('express')
const {isLoggedIn} = require('../middlewares/user')
const {createArticle,getArticleBySlug,updateArticle,deleteArticle,listArticles,favoriteArticle,unfavoriteArticle} = require('../controllers/articleControllers')

const router = express.Router()

router.post("/",isLoggedIn,createArticle)
router.get("/:slug",getArticleBySlug)
router.put("/:slug",isLoggedIn,updateArticle)
router.delete("/:slug",isLoggedIn,deleteArticle)
router.get("/",listArticles)
router.post("/:slug/favorite", isLoggedIn, favoriteArticle)
router.delete("/:slug/favorite", isLoggedIn,unfavoriteArticle)

module.exports = router