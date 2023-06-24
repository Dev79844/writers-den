const Comment = require('../models/comment')
const Article = require('../models/article');
const User = require('../models/user');

exports.createComment = async(req,res)=>{
    try {
        const id = req.user._id;

        const commenter = await User.findById(id);
    
        if (!commenter) {
            return res.status(401).json({
                message: "User Not Found"
            });
        }
        const { slug } = req.params;
    
        const article = await Article.findOne({slug})
    
        if (!article) {
            return res.status(401).json({
                message: "Article Not Found"
            });
        }
    
        const { body } = req.body.comment;
    
        const newComment = await Comment.create({
            body: body,
            author: commenter._id,
            article: article._id
        });
    
        await article.addComment(newComment._id)
    
        return res.status(200).json({
            comment: await newComment.toCommentResponse(commenter)
        })
    } catch (error) {
        throw error;
    }
}

exports.getCommentsForArticle = async(req,res) => {
    try {
        const {slug} = req.params;

        // const loggedIn = await User.findById(id)

        const article = await Article.findOne({slug})

        if(!article){
            res.status(404).json({
                message:"Article not found"
            })
        }

        const comments = await Comment.find({article: article._id})

        return await res.status(200).json({
            comments: await Promise.all(comments.map(async (comment) => {
                const temp = await comment.toCommentResponse(false);
                return temp;
              }))
        })
    } catch (error) {
        throw error;
    }
}

exports.deleteComment = async(req,res) => {
    try {
        const userId = req.user._id;

        const commenter = await User.findById(userId)

        if (!commenter) {
            return res.status(401).json({
                message: "User Not Found"
            });
        }
        const { slug, id } = req.params;

        const article = await Article.findOne({slug})

        if (!article) {
            return res.status(401).json({
                message: "Article Not Found"
            });
        }

        const comment = await Comment.findById(id)

        if (comment.author.toString() === commenter._id.toString()) {
            await article.removeComment(comment._id);
            await Comment.deleteOne({ _id: comment._id });
            return res.status(200).json({
                message: "comment has been successfully deleted!!!"
            });
        } else {
            return res.status(403).json({
                error: "only the author of the comment can delete the comment"
            })
        }

    } catch (error) {
        throw error;
    }
}