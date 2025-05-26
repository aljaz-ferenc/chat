const router = require("express").Router();
const notificationsController = require("../controllers/notificationsController");

router.route("/read").patch(notificationsController.readNotification);

module.exports = router;
