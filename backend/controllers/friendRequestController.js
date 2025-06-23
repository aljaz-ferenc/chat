const { connectToDatabase } = require("../models/mongoose");
const User = require("../models/User");
const Chat = require("../models/Chat");
const EventEmitter = require("../EventEmitter");

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

		EventEmitter.emit("friendRequest-incoming", receiverId);

		return res.sendStatus(204);
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

		EventEmitter.emit("friendRequest-declined", { receiverId, senderId });

		return res.status(204).json({ message: "success" });
	} catch (error) {
		console.log(error);
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

		EventEmitter.emit("friendRequest-accepted", { receiverId, senderId });

		const chatExists = await Chat.findOne({
			type: "single",
			users: { $all: [sender._id, receiver._id] },
			$expr: { $eq: [{ $size: "$users" }, 2] },
		});

		if (!chatExists) {
			const newChat = await Chat.create({
				type: "single",
				users: [sender._id, receiver._id],
			});

			await Promise.all([
				User.findByIdAndUpdate(sender._id, {
					$addToSet: { chats: newChat._id },
				}),
				User.findByIdAndUpdate(receiver._id, {
					$addToSet: { chats: newChat._id },
				}),
			]);
		}

		return res.status(204).json({ message: "success" });
	} catch (error) {
		console.log(error);
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

		EventEmitter.emit("friendRequest-canceled", { receiverId, senderId });

		return res.status(204).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};

exports.unfriend = async (req, res) => {
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
				"friends.friends": receiver._id,
			},
		});

		await User.findByIdAndUpdate(receiverId, {
			$pull: {
				"friends.friends": sender._id,
			},
		});

		EventEmitter.emit("friendRequest-unfriended", { senderId, receiverId });
		return res.status(204).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
};
