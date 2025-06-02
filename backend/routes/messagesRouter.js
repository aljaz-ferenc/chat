const router = require("express").Router();
const messageController = require("../controllers/messageController");

router.route("/").post(messageController.createMessage);

router.route("/:chatId").get(messageController.getMessagesByChat);

module.exports = router;
