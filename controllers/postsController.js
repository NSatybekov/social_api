const User = require('../models/userSchema')
const Post = require('../models/postSchema')
const jwtConfig = require('../config/jwt')
const Comment = require('../models/commentSchema')

exports.all_post_list = async (req,res) => {
    const postList = await Post.find({})
    res.json(postList)
}
 
exports.post_info = async (req,res) => {
    try {
        const post = await Post.findById(req.params.postId)
    res.json(post)
    }
    catch {
        res.status(400)
        res.send()
    }
}

exports.add_post = async (req,res, next) => {
    try{ 
        const postAuthor = await jwtConfig.getAuthData(req,res, next)
        const newPost = new Post({
            text_content : req.body.text_content,
            author: postAuthor._id
        })
            const savedPost = await newPost.save()
            const postId = await savedPost._id
            const updateUserInfo = {
                $push: {posts: postId}
            }
            const updatedAuthor = await User.findByIdAndUpdate(postAuthor._id, updateUserInfo)
            res.json(savedPost)
    } catch {
        res.status(403)
        res.end()
    }
}

exports.edit_post = async (req,res, next) => {
    try{
        const newPostDetails = {
            text_content : req.body.text_content
        }
        let updatedPost = await Post.findByIdAndUpdate(req.params.postId, newPostDetails)
        updatedPost = await Post.findById(req.params.postId) // need to make 2 requests because finandupdate return data befor update
        res.json(updatedPost)
}
    catch (err) {
        return next(err)
    }
}

exports.delete_post = async (req,res) => {
    try {
        let post = await Post.findById(req.params.postId) // need to make this request to get author ID
                const authorId = post.author
                const updateUserInfo = {
                    $pull : {posts: req.params.postId}
                } // or its better to use async series? if user will be deleted before update then it will cause troubles
                            let user = await User.findByIdAndUpdate(authorId, updateUserInfo)
                            post = await Post.findByIdAndDelete(req.params.postId)
                            user = await User.findById(authorId)
                                          res.json(user)
    }
    catch(err) {
        return next(err)
    }
}


// comments
exports.get_all_comments= async (req,res) => {
    try{
        const post = await Post.findById(req.params.postId)
    res.json(post.comments)
    }
    catch{
        res.sendStatus(404)
    }
}

exports.get_comment = async (req,res) => {
    try{
        const comment = await Comment.findById(req.params.commentId)
    res.json(comment)
    }
    catch{
        res.sendStatus(404)
    }
}

// get concrete comment

exports.add_comment = async (req,res, next) => {
    try{ 
        const commentAuthor = await jwtConfig.getAuthData(req,res, next)
        const commentAuthorId = commentAuthor._id
                    const newComment = new Comment( {
                        comments_text : req.body.comments_text,
                        author: commentAuthorId,
                        post: req.params.postId
                    })
                            const savedComment = await newComment.save()
                            const commentId = savedComment._id
                                    const addCommentToPost = {
                                        $push: {comments: commentId}
                                    }
                                        let updatedPost = await Post.findByIdAndUpdate(req.params.postId, addCommentToPost)
                                        updatedPost = await Post.findById(req.params.postId)
                            res.send(updatedPost + savedComment)  
    }
        catch(err){
            res.sendStatus(404)
            return next(err)
        }

} 

exports.edit_comment = async (req,res) => {
    try{ 
        const updateCommentInfo = {
            comments_text : req.body.comments_text
        }
                let updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, updateCommentInfo)
                updatedComment = await Comment.findById(req.params.commentId)
        res.json(updatedComment)
    }
    catch {
        res.sendStatus(401)
    }
} 

exports.delete_comment = async (req,res, next) => {
    // find and delete comment from comments array of post, update post info
    try{
        const updatePostInfo = {
            $pull : {comments: req.params.commentId}
        }  
        let updatedPost = await Post.findByIdAndUpdate(req.params.postId, updatePostInfo)
        updatedPost = await Post.findById(req.params.postId)
        const deleteComment = await Comment.findByIdAndDelete(req.params.commentId)
        res.json(updatedPost)
    }
    catch{
        res.sendStatus(404)
    }
}

// middleware checks if you comment author if not it will not let you to edit comment
exports.comment_author = async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    let loggedUser = await jwtConfig.getAuthData(req,res, next)
            loggedUser = loggedUser._id
            const commentAuthor = comment.author.toString()
                    if(commentAuthor === loggedUser) {
                        return next()
                    } else {
                        res.status(401).send('You are not owner of this comment')
                    }
}   // i can put this 2 middleware in object and invoke them by use - middleware.comment_author etc
// or use extends method in OOP when i add new middleware

exports.can_delete_comment = async (req,res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    const post = await Post.findById(req.params.postId)
    const postAuthor = post.author.toString()
    const commentAuthor = comment.author.toString()
            let loggedUser = await jwtConfig.getAuthData(req,res, next)
            loggedUser = loggedUser._id
                    if(loggedUser === postAuthor || loggedUser === commentAuthor) {
                        return next()
                    }  else {
                        res.status(401).send('You have not permission to delete this comment')
                    }
}

// find author id and comment author id in case of any matches delete return next middleware


// middleware to check if post exist or not (to avoid if statements in controller)
exports.post_exist = async (req, res,next) => {
    const postFind = await Post.findById(req.params.postId)
    if(postFind !== null) {
        return next()
    } else {
        return  res.status(404).send('There are no such post')
    }
}

exports.comment_exist = async(req,res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    if(comment !== null) {
        return next()
    } else {
        return res.status(404).send('There are no such comment')
    }
}