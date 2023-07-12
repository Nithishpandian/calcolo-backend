const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,     
    },
    emailId: {
        type: String,
        required: true,  
        unique: true   
    },
    password: {
        type: String,
        required: true,     
    },
},{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)