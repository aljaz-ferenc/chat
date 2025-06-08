const User = require("../models/User");
const Chat = require("../models/Chat");
const { connectToDatabase } = require("../models/mongoose");
const { mongoose } = require("mongoose");
const { io } = require("../socket");

exports.getAllChats = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const chats = await Chat.find({ users: userId })
			.populate("users", "firstName lastName username")
			.populate("lastMessage");

		res.status(200).json(chats);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

exports.getChat = async (req, res) => {
	try {
		const { chatId } = req.params;
		await connectToDatabase();
		const chat = await Chat.findById(chatId).populate("users", "firstName");

		if (!chat) {
			res.status(404).json({ message: "Chat not found" });
		}

		res.status(200).json(chat);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

exports.createChat = async (req, res) => {
	try {
		const { userId, chatType } = req.body;
		const user = await User.findById(userId);

		if (!user) {
			res.status(404).json({ message: "user not found" });
		}

		const newChat = await Chat.create({
			type: chatType,
			users: [user._id],
		});

		await User.findByIdAndUpdate(userId, {
			$addToSet: { chats: newChat._id },
		});

		res.sendStatus(201);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

exports.addUsersToChat = async (req, res) => {
	try {
		const { chatId } = req.params;
		const { usersIds } = req.body;

		const usersObjectIds = usersIds.map((u) => new mongoose.Types.ObjectId(u));

		const chat = await Chat.findByIdAndUpdate(chatId, {
			$addToSet: {
				users: { $each: usersObjectIds },
			},
		});

		const promises = usersIds.map((userId) => {
			return User.findByIdAndUpdate(userId, {
				$addToSet: { chats: chatId },
			});
		});

		await Promise.all(promises);

		if (!chat) {
			res.status(404).json({ message: "chat not found" });
		}

		res.sendStatus(200);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

exports.renameChat = async (req, res) => {
	try {
		const { chatId } = req.params;
		const { chatName } = req.body;

		const chat = await Chat.findByIdAndUpdate(chatId, {
			$set: { name: chatName },
		});

		if (!chat) {
			res.status(404).json({ message: "chat not found" });
		}

		io().to(chatId).emit("chat-rename", { chatId, chatName });

		res.sendStatus(200);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};
