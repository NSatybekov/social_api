const User = require('./models/userSchema')
const db = require('./config/database')

db.on('error', console.error.bind(console, 'MongoDB connection error'))


const test = function() { 
    const newUser = new User({
        username: 'Testing'
    })
    newUser.save()
    .then((user) => {
        console.log(user)
    })
}

test()