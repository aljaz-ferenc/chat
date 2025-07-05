const router = require("express").Router();
const messageController = require("../controllers/messageController");

router
	.route("/")
	.post(messageController.createMessage)
	.delete(messageController.deleteMessage);

router.route("/:chatId/:page").get(messageController.getMessagesByChat);

router.route("/:messageId").patch(messageController.editMessage);

router.route("/:messageId/reactions").post(messageController.addReaction);
module.exports = router;
