const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')
const loginController = require('./loginController')
const jwtConfig = require('../config/jwt')

exports.all_users_get = (req,res, next) => {
    User.find({}, (err, users) => {
        if(err) {return next(err)}
        res.json(users)
    }) 
}

exports.user_info_get = async function (req,res, next) { // need to remake it after creating likes etc (checking is this user profile owner)~
    try{
        const user = await User.findById(req.params.id)
        res.json(user)
    } 
    catch(err) {return res.json('No user')}
}

// сделать мой профиль другим эндпоинтом 
// my profile will contain another info - my likes, my messages etc 
// overal profile will be same for all - details just for owner - need to modificate json data in info - get


exports.user_info_update = async (req,res,next) => {
    const newUserDesc = {
        description: req.body.description,
    }
    try{
        let updatedUser = await User.findByIdAndUpdate(req.params.id, newUserDesc)
        updatedUser = await User.findById(req.params.id) // need to make request again to fetch data in other case it will return old data
        res.json(updatedUser) // more info in mongoose doc https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    } 
    catch(err) {return res.json('Some error'), next(err)}

}

exports.user_friends_list_get = async (req,res) => {
    try{
        const user = await User.findById(req.params.id) // found user by id in request - any user can view friends list
        
        res.json(user.friends)
    } 
    catch(err) {return next(err)}
}

exports.user_friend_info = (req,res) => {
    res.json({
        title : 'you will get info about how long you are friends'
    })
}


exports.user_friend_request_send = async (req,res, next) => { // getting data about request sender

    const sender = await User.findById(req.params.id)
    const sentStatus = sender.sent_friend_requests.includes(req.params.friendId)

// need to check if user that request sent in database and have you got him in friend list
try {
    if( sentStatus === false) { // also need to check if you have this received request
        const sendedFriendRequest = {
            $push : {sent_friend_requests: req.params.friendId}
        }
                const receivedFriendRequest = {
                    $push : {received_friend_requests: req.params.id}
                }
                            let updatedSender = await User.findByIdAndUpdate(req.params.id, sendedFriendRequest)
                            let updatedReceiver = await User.findByIdAndUpdate(req.params.friendId, receivedFriendRequest)
                            updatedSender = await User.findById(req.params.id)
        res.json(updatedSender)
    } else {
        res.send('you already have send friend request')
    }
} catch {
    res.status(403)
    res.end()
}
}

exports.user_friend_invite_accept = async (req,res, next) => {
    const requestAccepter = await User.findById(req.params.id)

    try {
        const receivedRequestStatus = requestAccepter.received_friend_requests.includes(req.params.friendId)
        const inFriendsListCheck = requestAccepter.friends.includes(req.params.friendId)
        if(receivedRequestStatus === true) {
            const updatedReceiverInfo = {
                $push : {friends : req.params.friendId },
                $pull : { received_friend_requests : req.params.friendId}
            }
            const updatedSenderInfo = {
                $push : {friends : req.params.id},
                $pull : {sent_friend_requests : req.params.id}
            } // updating info of users
            const updatedSender = await User.findByIdAndUpdate(req.params.friendId, updatedSenderInfo)
            let updatedReceiver = await User.findByIdAndUpdate(req.params.id, updatedReceiverInfo)
            // need to update senders info delete from sended friend requests
            updatedReceiver = await User.findById(req.params.id)
            res.json(updatedReceiver)
        }  if(inFriendsListCheck === true) {
            res.send('This user is in your friends list already').status(401)
        } 
        else{
            res.send('No such friend request').status(402)
        }
    } 
    catch {
        res.status(403)
        res.end()
    }
}



exports.user_friend_delete = async (req,res) => {
    const deletingUser = await User.findById(req.params.id)
    try{
        const inFriendsListCheck = deletingUser.friends.includes(req.params.friendId)
        if(inFriendsListCheck === true) {
            const newUserInfo = {
                $pull : {friends : req.params.friendId}
            }
            const updateFriendProfile = await User.findByIdAndUpdate(req.params.friendId, {$pull : {friends : req.params.id}})
            let updatedUser = await User.findByIdAndUpdate(req.params.id, {$pull : {friends : req.params.friendId}})
            updatedUser = await User.findById(req.params.id)
            res.json(updatedUser)
        }
    } catch {
        res.status(403)
        res.end()
    }
 }