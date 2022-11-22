var express = require('express');
var router = express.Router();
const loginController = require('../controllers/loginController')
const jwtConfig = require('../config/jwt')

/* GET home page. */
router.get('/', loginController.index);

router.post('/registration', jwtConfig.verifyToken, loginController.registration_post)

router.post('/login', jwtConfig.verifyToken, loginController.login_post)

router.post('/logout', jwtConfig.verifyToken, loginController.logout_post)



module.exports = router;
