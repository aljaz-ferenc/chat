const { connectToDatabase } = require("../models/mongoose");
const User = require("../models/User");

exports.sendFriendRequest = async (req, res) => {
	try {
		const { senderId, receiverId } = req.body;
		await connectToDatabase();
		const sender = await User.findById(senderId);
		const receiver = await User.findById(receiverId);

		if (!sender || !receiver) {
			return res.status(404).json({ message: "user not found" });
		}

		await User.findByIdAndUpdate(senderId, {
			$addToSet: {
				"friends.pendingRequests": receiver._id,
			},
		});

		await User.findByIdAndUpdate(receiverId, {
			$addToSet: {
				"friends.incomingRequests": sender._id,
			},
		});

		res.status(200).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};

//TODO
exports.acceptFriendRequest = async (req, res) => {
	try {
		const { senderId, receiverId } = req.body;
		await connectToDatabase();
		const sender = await User.findById(senderId);
		const receiver = await User.findById(receiverId);

		if (!sender || !receiver) {
			return res.status(404).json({ message: "user not found" });
		}

		await User.findByIdAndUpdate(senderId, {
			$addToSet: {
				"friends.pendingRequests": receiver._id,
			},
		});

		await User.findByIdAndUpdate(receiverId, {
			$addToSet: {
				"friends.incomingRequests": sender._id,
			},
		});

		res.status(200).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};

//TODO
exports.cancelFriendRequest = async (req, res) => {
	try {
		const { senderId, receiverId } = req.body;
		await connectToDatabase();
		const sender = await User.findById(senderId);
		const receiver = await User.findById(receiverId);

		if (!sender || !receiver) {
			return res.status(404).json({ message: "user not found" });
		}

		await User.findByIdAndUpdate(senderId, {
			$pull: {
				"friends.pendingRequests": receiver._id,
			},
		});

		await User.findByIdAndUpdate(receiverId, {
			$pull: {
				"friends.incomingRequests": sender._id,
			},
		});

		res.status(200).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};
