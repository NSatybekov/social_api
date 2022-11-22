const jwt = require('jsonwebtoken')
const passport = require('passport')
const Post = require('../models/postSchema')

const getToken = async function (req,res, next) {
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        return req.token
    } else {
        res.sendStatus(403)
    }
} 


exports.verifyToken = async (req,res, next) => {
    try {
        const token = await getToken(req,res,next)
        jwt.verify(token, process.env.SECRET_KEY)
        next()
    }
    catch {
        res.sendStatus(403)
    }
}

async function getAuthData(req,res,next) {
    const bearerHeader = req.headers['authorization']
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        const authData = await jwt.verify(bearerToken, process.env.SECRET_KEY)
        const userData = await authData.userAuth.user
        return userData

}


exports.profileOwner = (req,res, next) => {

    jwt.verify(req.token, process.env.SECRET_KEY, (err, userData) => { // userData is data that we got from 
        if(err) {return next(err)}
        checkIdOwner(req.params.id, userData.userAuth.user._id, res, next)
    })  // IT WILL ONLY WORK ONLY WITH USERS ROUTER - NEED TO WORK IN ANOTHER FORMAT 
    // in case with posts need to get data from authorID field - and this method will not work
}

exports.postOwner = async (req, res,next) => {
    const loggedUser = await jwt.verify(req.token, process.env.SECRET_KEY)
    const post = await Post.findById(req.params.postId)
    const postAuthor = post.author.toString()
    checkIdOwner(postAuthor,loggedUser.userAuth.user._id, res,next)

}

function checkIdOwner (idFromParam, idFromToken, res, next) {
    if(idFromParam === idFromToken) {
        return next()
    }
    else {
        res.status(401)
         res.send('You are not owner of this')
    }
}

module.exports.getToken = getToken
module.exports.getAuthData = getAuthData 
