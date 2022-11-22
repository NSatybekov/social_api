const crypto = require('crypto')
const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')

exports.index = (req,res) => {
    res.send('Main info not implemented yet')
}

exports.registration_post = (req,res, next) => {
    const saltHash = hashPassword(req.body.password)
        User.findOne({username: req.body.username})
            .exec((err, found_user) => {
                if(err) {return next(err)}
                if(found_user) {
                    res.status(405).send('User already in database ')
                }
                else{
                    const salt = saltHash.salt;
                    const hash = saltHash.hash
                    const newUser = new User({
                        username: req.body.username,
                        salt : salt,
                        hash: hash
                    });
                    newUser.save()
                        .then((user) => {
                            jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '1h'}, (err, token) => {
                                res.json({
                                    token : token,
                                    user: user
                                })
                            })
                        })
                }             
            })
}

exports.login_post =  async function (req,res)  {
    const userAuth = await authUser(req.body.username, req.body.password)
        if(userAuth.status === 200) { // максимально тупо - ответ просто равен неудачному входу - фронт не увидит конкретный тип
            jwt.sign({userAuth}, process.env.SECRET_KEY, (err, token) => {
                res.json({
                    token: token,
                    user: userAuth.user
                })
            })
        } else {
            res.status(userAuth.status).send(userAuth.message)
        }
}

exports.logout_post = (req,res) => {
        res.send('Logout will be later')
}


async function authUser(username, password) {
                    try{
                        const user = await User.findOne({username: username})
                        if(!user) { 
                            return {message : 'User Not found', 
                            status : 403}
                        } 
                        const isValid = validPassword(password, user.hash, user.salt)
                        if(isValid) {
                            return { status : 200,
                                user : user
                            }
                        }
                        else{
                            return {message : 'Password not correct', 
                            status : 403}
                        }
                    } catch {
                        return {message : 'Something went wrong', 
                        status : 403}
                    }

}

function hashPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };

}

function validPassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

