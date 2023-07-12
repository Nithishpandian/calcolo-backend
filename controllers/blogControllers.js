const asyncHandler = require("express-async-handler")
const Blog = require("../models/blogModel")
const User = require("../models/userModel")
const cloudinary = require("../config/cloudinary")

// @desc    Get blogs
// @route   GET /api/blogs
// @access  private
const getBlogs = asyncHandler(async(req, res)=>{
    const blogs = await Blog.find()
    res.status(200).json(blogs)
})

// @desc    Set blog
// @route   POST /api/blogs
// @access  private
const setBlog = asyncHandler(async(req, res)=>{
    if(!req.body.content || !req.body.title){
        res.status(400)
        throw new Error("Please add a text field")
    }
    try {
        const result = await cloudinary.uploader.upload(req.body.image,{
            folder: "uploads"
        })
        const blogs = await Blog.create({
            title: req.body.title,
            content: req.body.content,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },
            user: req.user.id
        })
        res.status(200).json(blogs)
    } catch (error) {
        console.log(error);
    }
})

// @desc    update blog
// @route   PUT /api/blog/:id
// @access  private
const updateBlog = asyncHandler(async(req, res)=>{
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        res.status(400)
        throw new Error("Blog not found")
    }
    const user = await User.findById(req.user.id)
    
    // Check for user
    if(!user){
        res.status(401)
        throw new Error("User not found")
    }

    // Make sure the logged in user matches
    if(blog.user._id.toString() !== user.id){
        res.status(401)
        throw new Error("User not authorized to Update")
    }

    // Uploading a image to cloudinary
    const result = await cloudinary.uploader.upload(req.body.image,{
        folder: "uploads"
    })

    // Destructuring the content
    const {title, content} = req.body
    const userId = user.id
    const image = {
        public_id: result.public_id,
        url: result.secure_url
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {title, content, image, userId},{new: true})
    res.status(200).json(updatedBlog)
})

// @desc    delete blog
// @route   DELETE /api/blog/:id
// @access  private
const deleteBlog = asyncHandler(async(req, res)=>{
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        res.status(400)
        throw new Error("Goal not found")
    }
    const user = await User.findById(req.user.id)
    
    // Check for user
    if(!user){
        res.status(401)
        throw new Error("User not found")
    }

    // Make sure the logged in user matches
    if(blog.user._id.toString() !== user.id){
        res.status(401)
        throw new Error("User not authorized to Delete")
    }

    await Blog.deleteOne(blog)
    res.status(200).json({id: req.params.id})
})

// @desc    Get blog
// @route   GET /api/blog/:id
// @access  private
const getBlog = asyncHandler(async(req, res)=>{
    const blog = await Blog.findById(req.params.id)
    res.status(200).json(blog)
})

module.exports = {
    getBlogs,
    setBlog,
    updateBlog,
    deleteBlog,
    getBlog
}