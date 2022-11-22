var express = require('express');
var router = express.Router();
const userController = require('../controllers/usersController')
const loginController = require('../controllers/loginController')
const jwtConfig = require('../config/jwt')

/* GET users listing. */
router.get('/', userController.all_users_get ); //done 

router.get('/:id', jwtConfig.verifyToken, userController.user_info_get) 

router.put('/:id',jwtConfig.verifyToken, jwtConfig.profileOwner, userController.user_info_update) 

router.get('/:id/friend',jwtConfig.verifyToken, userController.user_friends_list_get) 

router.get('/:id/friend/:friendId', userController.user_friend_info) // зачем??? или переводить на профиль друга

router.post('/:id/friend/:friendId', jwtConfig.verifyToken, jwtConfig.profileOwner, userController.user_friend_request_send)

router.put('/:id/friend/:friendId', jwtConfig.verifyToken, jwtConfig.profileOwner, userController.user_friend_invite_accept)

router.delete('/:id/friend/:friendId', jwtConfig.verifyToken, jwtConfig.profileOwner, userController.user_friend_delete)


// profile owner NOT WORKING WITHOUT VERIFY TOKEN

module.exports = router;
