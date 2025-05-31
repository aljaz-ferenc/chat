const router = require("express").Router();
const friendRequestController = require("../controllers/friendRequestController");

router.route("/send").post(friendRequestController.sendFriendRequest);

router.route("/accept").post(friendRequestController.acceptFriendRequest);

router.route("/cancel").post(friendRequestController.cancelFriendRequest);

router.route("/decline").post(friendRequestController.declineFriendRequest);

router.route("/unfriend").post(friendRequestController.unfriend);

module.exports = router;
