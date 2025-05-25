const User = require('../models/user');
const {connectToDatabase} = require("../models/mongoose");

exports.getAllUsers = async (req, res) => {
    try{
        await connectToDatabase()
        const users = await User.find()

        res.status(200).json(users)
    }catch(error){
        console.error(error)
    }
}
