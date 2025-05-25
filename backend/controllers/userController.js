const User = require('../models/user');
const {connectToDatabase} = require("../models/mongoose");

exports.getAllUsers = async (req, res) => {
    try {
        await connectToDatabase()
        const users = await User.find()

        res.status(200).json(users)
    } catch (error) {
        console.error(error)
    }
}

exports.getUser = async (req, res) => {
    try {
        const {clerkId} = req.params
        await connectToDatabase()
        const user = await User.findOne({clerkId})
        console.log(user._id)

        res.status(200).json(user)
    } catch (error) {
        console.error(error)
    }
}