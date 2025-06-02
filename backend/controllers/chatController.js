const User = require("../models/User");
const Chat = require("../models/Chat");

exports.getAllChats = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const chats = await Chat.find({ users: userId }).populate(
			"users",
			"firstName lastName username",
		);

		res.status(200).json(chats);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};
