const chatController = require("../controllers/chatController");

const router = require("express").Router();

router.route("/").post(chatController.createChat);
router.route("/user/:userId").get(chatController.getAllChats);
router.route("/:userId1/:userId2").get(chatController.getChatByUsers);
router
	.route("/:chatId")
	.get(chatController.getChat)
	.patch(chatController.addUsersToChat)
	.put(chatController.renameChat);

router.route("/:chatId/leave").patch(chatController.leaveChat);

module.exports = router;
