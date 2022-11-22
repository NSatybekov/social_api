const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type: String, required: true, maxlength : 20},
    description : {type: String, default: ' ',maxlength: 500},
    friends: [{type: Schema.Types.ObjectId, ref: "User"}],
    sent_friend_requests: [{type: Schema.Types.ObjectId, ref: "User"}],
    received_friend_requests : [{type: Schema.Types.ObjectId, ref: "User"}],
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}],
    comments : [{}],
    likes : [{}],
    salt : {type: String},
    hash : {type: String},

})

UserSchema.virtual('url').get(() => {
    return `/users/${this._id}`
})


module.exports = mongoose.model('User', UserSchema)