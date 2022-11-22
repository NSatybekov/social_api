const express = require('express');
const router = express.Router()
const postsController = require('../controllers/postsController')
const jwtConfig = require('../config/jwt')

/* GET users listing. */
router.get('/', postsController.all_post_list);

router.post('/', jwtConfig.verifyToken, postsController.add_post)

router.get('/:postId', postsController.post_exist,postsController.post_info ) 

 
router.put('/:postId',jwtConfig.verifyToken, postsController.post_exist, jwtConfig.postOwner,  postsController.edit_post)

router.delete('/:postId',jwtConfig.verifyToken, postsController.post_exist, jwtConfig.postOwner, postsController.delete_post)

// comments

router.get('/:postId/comments', jwtConfig.verifyToken, postsController.post_exist, postsController.get_all_comments ) 


router.post('/:postId/comments', jwtConfig.verifyToken, postsController.post_exist, postsController.add_comment)

router.get('/:postId/comments/:commentId',jwtConfig.verifyToken, postsController.post_exist, postsController.comment_exist, postsController.comment_author,  postsController.get_comment)

router.put('/:postId/comments/:commentId', jwtConfig.verifyToken, postsController.post_exist, postsController.comment_exist, postsController.comment_author,  postsController.edit_comment)

router.delete('/:postId/comments/:commentId',jwtConfig.verifyToken,  postsController.post_exist, postsController.comment_exist, postsController.can_delete_comment,  postsController.delete_comment)

// need to check if comment exist before other middleware - because other middleware will cause errors

module.exports = router