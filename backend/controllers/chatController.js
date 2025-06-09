const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { connectToDatabase } = require("../models/mongoose");
const { mongoose } = require("mongoose");
const { io, onlineUsers } = require("../socket");

exports.getAllChats = async (req, res) => {
	try {
		const { userId } = req.params;
		await connectToDatabase();
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const chats = await Chat.find({ users: userId })
			.populate("users", "firstName lastName username")
			.populate("lastMessage");

		res.status(200).json(chats);
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Server error" });
	}
};

exports.getChat = async (req, res) => {
	try {
		const { chatId } = req.params;
		await connectToDatabase();
		const chat = await Chat.findById(chatId).populate("users", "firstName");

		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}

		res.status(200).json(chat);
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Server error" });
	}
};

exports.createChat = async (req, res) => {
	try {
		const { userId, chatType } = req.body;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}

		await connectToDatabase();

		const newChat = await Chat.create({
			type: chatType,
			users: [user._id],
		});

		await User.findByIdAndUpdate(userId, {
			$addToSet: { chats: newChat._id },
		});

		const socketId = onlineUsers.get(userId);
		if (socketId) {
			const socket = io().sockets.sockets.get(socketId);
			if (socket) {
				socket.join(newChat._id.toString());
			}
		}

		res.status(203).json({chatId: newChat._id})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Server error" });
	}
};

exports.addUsersToChat = async (req, res) => {
	try {
		const { chatId } = req.params;
		const { usersIds } = req.body;

		const usersObjectIds = usersIds.map((u) => new mongoose.Types.ObjectId(u));

		await connectToDatabase();

		const chat = await Chat.findByIdAndUpdate(chatId, {
			$addToSet: {
				users: { $each: usersObjectIds },
			},
		});

		if (!chat) {
			res.status(404).json({ message: "chat not found" });
		}

		const promises = usersIds.map((userId) => {
			return User.findByIdAndUpdate(userId, {
				$addToSet: { chats: chatId },
			});
		});

		await Promise.all(promises);

		// biome-ignore lint/complexity/noForEach: <explanation>
		usersIds.forEach((userId) => {
			const socketId = onlineUsers.get(userId);
			if (socketId) {
				const socket = io().sockets.sockets.get(socketId);
				if (socket) {
					socket.join(chatId);
					socket.emit("added-to-group", { chatId });
				}
			}
		});

		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error" });
	}
};

exports.renameChat = async (req, res) => {
	try {
		const { chatId } = req.params;
		const { chatName } = req.body;

		await connectToDatabase();

		const chat = await Chat.findByIdAndUpdate(chatId, {
			$set: { name: chatName },
		});

		if (!chat) {
			return res.status(404).json({ message: "chat not found" });
		}

		io().to(chatId).emit("chat-rename", { chatId, chatName });

		res.sendStatus(204);
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Server error" });
	}
};

exports.leaveChat = async (req, res) => {
	try {
		const { chatId } = req.params;
		const { userId } = req.body;

		await connectToDatabase();

		const chat = await Chat.findById(chatId);
		if (!chat) {
			return res.status(404).json({ message: "chat not found" });
		}

		if (chat.users.length > 1) {
			await Chat.findByIdAndUpdate(chatId, {
				$pull: { users: userId },
			});
		} else {
			await Chat.findByIdAndDelete(chatId);
			await Message.deleteMany({chat:chatId})
		}

		const user = await User.findByIdAndUpdate(userId, {
			$pull: { chats: chatId },
		});
		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}

		const socketId = onlineUsers.get(userId);
		if (socketId) {
			const socket = io().sockets.sockets.get(socketId);
			if (socket) {
				socket.leave(chatId);
			}
		}

		io().to(chatId).emit("user-left", { chatId, userId });

		res.sendStatus(204);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};
