const chatController = require("../controllers/chatController");

const router = require("express").Router();

router.route("/user/:userId").get(chatController.getAllChats);
router.route("/:chatId").get(chatController.getChat);

module.exports = router;
