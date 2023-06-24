const Article = require('../models/article')

exports.getTags = async(req,res) => {
    try {
        const tags = await Article.find({}).distinct('tagList')

        res.status(200).json({
            tags: tags
        })
    } catch (error) {
        throw error;
    }
}