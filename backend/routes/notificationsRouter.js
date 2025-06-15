const router = require("express").Router();
const notificationsController = require("../controllers/notificationsController");

router.route("/read").patch(notificationsController.readNotification);
router.route('/').delete(notificationsController.deleteNotifications)

module.exports = router;
