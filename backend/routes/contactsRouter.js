const router = require("express").Router();
const contactController = require("../controllers/contactController");

router.route("/:userId/").get(contactController.getContacts);
router.route("/:userId/:contactId").get(contactController.getContact);

module.exports = router;
