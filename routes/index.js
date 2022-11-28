var express = require('express');
var router = express.Router();
const loginController = require('../controllers/loginController')
const jwtConfig = require('../config/jwt')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')


/* GET home page. */
// router.use('/',swaggerUi.serve, swaggerUi.setup(swaggerDocument) )

router.get('/', loginController.index);

router.post('/registration',  loginController.registration_post)

router.post('/login',  loginController.login_post)




module.exports = router;
