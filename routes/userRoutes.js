const express = require("express")
const router = express.Router()
const {registerUser, loginUser, usersData, getUserDetails} = require("../controllers/userControllers")

const { protect } = require("../middlewares/authMiddleware")

router.post("/", registerUser)
router.post("/login", loginUser)
router.get("/data", protect, usersData)
router.get("/:id", protect, getUserDetails)

module.exports = router