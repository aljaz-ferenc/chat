const router = require("express").Router();
const userController = require("../controllers/userController");

router.route("/").get(userController.getAllUsers);

router.route("/:clerkId").get(userController.getUser);

router.route("/search/:query").get(userController.searchUsers);

module.exports = router;
