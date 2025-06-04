const router = require("express").Router();
const messageController = require("../controllers/messageController");

router
	.route("/")
	.post(messageController.createMessage)
	.delete(messageController.deleteMessage);

router.route("/:chatId").get(messageController.getMessagesByChat);

module.exports = router;
