const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authAdminMiddleware } = require("../middlewares/authMiddleware");

// Quản lý tài khoản
router.post("/login", adminController.loginAdmin); 
router.post("/register-owner", authAdminMiddleware, adminController.registerOwner); 
router.get("/list-owners", authAdminMiddleware, adminController.listOwners); 
router.get("/list-users", authAdminMiddleware, adminController.listUsers); 
router.put("/update-owner/:id", authAdminMiddleware, adminController.updateOwner); 
router.delete("/delete-owner/:id", authAdminMiddleware, adminController.deleteOwner); 
router.delete("/delete-user/:id", authAdminMiddleware, adminController.deleteUser); 

// Quản lý Homestay/Resort
router.put("/update-homestay/:id", authAdminMiddleware, adminController.updateHomestay); 
router.get("/list-homestays", authAdminMiddleware, adminController.listHomestays); 
router.post("/manage-categories", authAdminMiddleware, adminController.manageCategories); 
router.post("/manage-locations", authAdminMiddleware, adminController.manageLocations); 
router.post("/manage-amenities", authAdminMiddleware, adminController.manageAmenities); 

module.exports = router;