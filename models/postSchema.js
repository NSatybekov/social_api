const mongoose = require('mongoose')

const Schema = mongoose.Schema

// описание поста, дата публикации, лайки (ссылка на лайки), автор, комменты (ссылка на комменты) 

const postSchema = new Schema({
    text_content: {type: String, required: true, maxlength : 1000},
    created_at : {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: "User"},
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
//добавить тэги
})

 

module.exports = mongoose.model('Post', postSchema)

