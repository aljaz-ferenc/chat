const { connectToDatabase } = require("../models/mongoose");
const User = require("../models/User");
const { onlineUsers, io } = require("../socket");
const { isOnline } = require("../utils/socket");

exports.sendFriendRequest = async (req, res) => {
	try {
		const { senderId, receiverId } = req.body;
		await connectToDatabase();
		const sender = await User.findById(senderId);
		const receiver = await User.findById(receiverId);

		if (!sender || !receiver) {
			return res.status(404).json({ message: "user not found" });
		}

		const notification = {
			read: false,
			type: "friendRequest",
			from: sender._id,
		};

		await User.findByIdAndUpdate(senderId, {
			$addToSet: {
				"friends.pendingRequests": receiver._id,
			},
		});

		await User.findByIdAndUpdate(receiverId, {
			$addToSet: {
				"friends.incomingRequests": sender._id,
			},
			$push: { "notifications.notifications": notification },
			$set: { "notifications.opened": false },
		});

		if (onlineUsers.has(receiverId)) {
			const receiver = onlineUsers.get(receiverId);
			io().to(receiver).emit("friendRequest-incoming", {
				from: senderId,
			});
			io().to(receiver).emit("notification-new");
		}

		res.status(200).json({ message: "success" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};

exports.declineFriendRequest = async (req, res) => {
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
				"friends.incomingRequests": receiver._id,
			},
		});

		await User.findByIdAndUpdate(receiverId, {
			$pull: {
				"friends.pendingRequests": sender._id,
			},
		});

		if (onlineUsers.has(receiverId)) {
			const receiver = onlineUsers.get(receiverId);
			io().to(receiver).emit("friendRequest-declined", {
				from: senderId,
			});
		}

		res.status(200).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};

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
				"friends.friends": receiver._id,
			},
			$pull: {
				"friends.incomingRequests": receiver._id,
			},
		});

		await User.findByIdAndUpdate(receiverId, {
			$addToSet: {
				"friends.friends": sender._id,
			},
			$pull: {
				"friends.pendingRequests": sender._id,
			},
		});

		if (onlineUsers.has(receiverId)) {
			const receiver = onlineUsers.get(receiverId);
			io().to(receiver).emit("friendRequest-accepted", {
				from: senderId,
			});
		}

		res.status(200).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};

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

		if (onlineUsers.has(receiverId)) {
			const receiver = onlineUsers.get(receiverId);
			io().to(receiver).emit("friendRequest-canceled", {
				from: senderId,
			});
		}

		res.status(200).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};
