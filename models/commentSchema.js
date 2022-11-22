const mongoose = require('mongoose')

const Schema = mongoose.Schema

// описание коммента, дата коммента, автор коммента, ссылка на пост 

const commentSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref : "User", required: true},
    comments_text: {type: String, maxLength: 1000},
    post: {type: Schema.Types.ObjectId, ref : "Post", required: true}
})

module.exports = mongoose.model('Comment', commentSchema)