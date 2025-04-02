const express = require("express");
const { getUsers, createUser, deleteUser, toggleUserStatus } = require("../controllers/adminController");
const router = express.Router();
router.get("/users", getUsers);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/status", toggleUserStatus);
module.exports = router;
