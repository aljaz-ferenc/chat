const chatController = require("../controllers/chatController");

const router = require("express").Router();

router.route("/user/:userId").get(chatController.getAllChats);

module.exports = router;
