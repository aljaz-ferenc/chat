const router = require('express').Router();
const userController = require('../controllers/userController');

router.route('/')
    .get(userController.getAllUsers);

router.route('/:clerkId')
    .get(userController.getUser)


module.exports = router;