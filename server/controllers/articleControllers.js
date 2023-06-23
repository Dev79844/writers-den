const Article = require('../models/article')
const User = require('../models/user')

exports.createArticle = async(req,res) => {
    try {
        const userId = req.user._id

        const author = await User.findById(userId)

        const {title,description,body,tagList} = req.body.article 

        if(!title || !description || !body){
            res.status(400).json({message: "All fields are required"});
        }

        const article = await Article.create({title,description,body})

        article.author = userId

        if(Array.isArray(tagList) && tagList.length > 0){
            article.tagList = tagList
        }

        await article.save()

        return await res.status(200).json({
            article: await article.toArticleResponse(author)
        })    

    } catch (error) {
        throw error;
    }
}

exports.getArticleBySlug = async(req,res) => {
    try {
        const slug = req.params.slug

        const article = await Article.findOne({slug})

        if (!article) {
            return res.status(401).json({
                message: "Article Not Found"
            });
        }
    
        return res.status(200).json({
            article: await article.toArticleResponse(false)
        })
    } catch (error) {
        throw error;
    }
}

exports.updateArticle = async(req,res) => {
    try {

        const {article} = req.body
        
        const slug = req.params.slug

        const author = await User.findById(req.user._id)

        const target = await Article.findOne({slug})

        if(article.title){
            target.title = article.title
        }

        if(article.description){
            target.description = article.description
        }

        if(article.body){
            target.body = article.body
        }

        if(article.tagList){
            target.tagList = article.tagList
        }

        await target.save()

        res.status(200).json({
            article: await target.toArticleResponse(author)
        })

    } catch (error) {
        throw error;
    }
}

exports.deleteArticle = async(req,res) => {
    try {
        
        const article = await Article.findOne({slug: req.params.slug})

        const loggedUser = await User.findById(req.user._id)

        if(!loggedUser){
            res.status(200).json({
                message:"User not found"
            })
        }

        if(!article){
            res.ststus(200).json({
                message:"Article not found"
            })
        }

        if(article.author.toString() === loggedUser._id.toString()){
            await Article.deleteOne({slug:req.params.slug})
            res.status(200).json({
                message:"Article deleted successfully"
            })
        }else{
            res.status(401).json({
                message:"You are not authorised to delete this article"
            })
        }

    } catch (error) {
        throw error;
    }
}

exports.getArticlesForFeed = async(req,res) => {
    try {
        let limit = 10;
        let offset = 0;

        if(req.query.limit){
            limit = req.query.limit
        }

        if(req.query.offset){
            offset = req.query.offset
        }

        const loggedUser = await User.findById(req.user._id)

        const articles = await Article.find({author:{$in: loggedUser.followingUsers}}).sort({createdAt:-1}).limit(Number(limit)).skip(Number(offset))

        const articleCount = await Article.find({author:{$in: loggedUser.followingUsers}}).count()

        res.status(200).json({
            articles: articles.map(async(article) => {
                await article.toArticleResponse(loggedUser)
            }),
            articleCount: articleCount
        })
    } catch (error) {
        throw error;
    }
}

exports.favoriteArticle = async (req, res) => {
    try {
        const id = req.user._id;

        const { slug } = req.params;

        const loginUser = await User.findById(id)

        if (!loginUser) {
            return res.status(401).json({
                message: "User Not Found"
            });
        }

        const article = await Article.findOne({slug})

        if (!article) {
            return res.status(401).json({
                message: "Article Not Found"
            });
        }
        // console.log(`article info ${article}`);

        await loginUser.favorite(article._id);

        const updatedArticle = await article.updateFavoriteCount();

        return res.status(200).json({
            article: await updatedArticle.toArticleResponse(loginUser)
        });
    } catch (error) {
        throw error;
    }
};

exports.unfavoriteArticle = async (req, res) => {
    try {
        const id = req.user._id;

        const { slug } = req.params;

        const loginUser = await User.findById(id)

        if (!loginUser) {
            return res.status(401).json({
                message: "User Not Found"
            });
        }

        const article = await Article.findOne({slug})

        if (!article) {
            return res.status(401).json({
                message: "Article Not Found"
            });
        }

        await loginUser.unfavorite(article._id);

        await article.updateFavoriteCount();

        return res.status(200).json({
            article: await article.toArticleResponse(loginUser)
        });
    } catch (error) {
        throw error;
    }
}

exports.listArticles = async (req, res) => {
    let limit = 20;
    let offset = 0;
    let query = {};
    if (req.query.limit) {
        limit = req.query.limit;
    }

    if (req.query.offset) {
        offset = req.query.offset;
    }
    if (req.query.tag) {
        query.tagList = {$in: [req.query.tag]}
    }

    if (req.query.author) {
        const author = await User.findOne({username: req.query.author})
        if (author) {
            query.author = author._id;
        }
    }

    if (req.query.favorited) {
        const favoriter = await User.findOne({username: req.query.favorited})
        if (favoriter) {
            query._id = {$in: favoriter.favouriteArticles}
        }
    }

    const filteredArticles = await Article.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})

    const articleCount = await Article.count(query);

    if (req.loggedin) {
        const loginUser = await User.findById(req.user._id);
        return res.status(200).json({
            articles: await Promise.all(filteredArticles.map(async article => {
                return await article.toArticleResponse(loginUser);
            })),
            articlesCount: articleCount
        });
    } else {
        return res.status(200).json({
            articles: await Promise.all(filteredArticles.map(async article => {
                return await article.toArticleResponse(false);
            })),
            articlesCount: articleCount
        });
    }
};
