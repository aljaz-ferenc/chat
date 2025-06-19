const express = require("express");
const router = require("express").Router();
const { users } = require("../controllers/webhooksController");

router.post("/", users);

module.exports = router;
