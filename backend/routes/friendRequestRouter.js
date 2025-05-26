const router = require("express").Router();
const friendRequestController = require("../controllers/friendRequestController");

router.route("/send").post(friendRequestController.sendFriendRequest);

router.route("/accept").post(friendRequestController.acceptFriendRequest);

router.route("/cancel").post(friendRequestController.cancelFriendRequest);

module.exports = router;
