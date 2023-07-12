const express = require("express")
const router = express.Router()
const {getBlogs, setBlog, updateBlog, deleteBlog, getBlog} = require("../controllers/blogControllers")
const { protect } = require("../middlewares/authMiddleware")

router.get("/", protect, getBlogs)

router.post("/", protect, setBlog)

router.put("/:id", protect, updateBlog)

router.delete("/:id", protect, deleteBlog)

router.get("/:id", protect, getBlog)

module.exports = router