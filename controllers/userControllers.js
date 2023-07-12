const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")

// @desc    Register new user
// @route   POST /api/users
// @access  public
const registerUser = asyncHandler(async(req, res)=>{
    const { userName, emailId, password } = req.body
    if(!userName || !emailId || !password){
        res.status(400)
        throw new Error("Please add all the fields")
    }

    // Check User
    const checkUser = await User.findOne({emailId})
    if(checkUser){
        res.status(400)
        throw new Error("User already Exists")
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    // Creating User
    const user = await User.create({
        userName,
        emailId,
        password: hashedPassword
    })
    if(user){
        res.status(201).json({
            _id: user.id,
            userName: user.userName,
            emailId: user.emailId,
            token: generateToken(user._id),
        })
    }
    else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})


// @desc    login User
// @route   POST /api/users/login
// @access  public
const loginUser = asyncHandler(async(req, res)=>{
    const {emailId, password} = req.body
    const user = await User.findOne({emailId})
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(201).json({
            _id: user.id,
            userName: user.userName,
            emailId: user.emailId,
            token: generateToken(user._id),
        })
    }
    else{
        res.status(400)
        throw new Error("Invalid Credentials")
    }
})


// @desc    Get Users data
// @route   GET /api/users/data
// @access  private
const usersData = asyncHandler(async(req, res)=>{
    const {_id, userName, emailId} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        userName,
        emailId
    })
})

// @desc    Get blog users data
// @route   GET /api/users/:id
// @access  private
const getUserDetails = asyncHandler(async(req, res)=>{
    const {id, userName} = await User.findById(req.params.id)
    res.status(200).json({
        id: id,
        userName,
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
}

module.exports = {
    registerUser,
    loginUser,
    usersData,
    getUserDetails,
}