const express = require("express");
const router = require("express").Router();
const { users } = require("../controllers/webhooksController");

router.post("/clerk", express.raw({ type: "application/json" }), users);

module.exports = router;
