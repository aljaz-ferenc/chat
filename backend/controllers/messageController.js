const { connectToDatabase } = require("../models/mongoose");
const {
	Message,
	UserMessage,
	RenameChatMessage,
} = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");
const EventEmitter = require("../EventEmitter");

exports.createMessage = async (req, res) => {
	try {
		const { message } = req.body;
		console.log(message)
		await connectToDatabase();

		const user = await User.findById(message.user);
		await Chat.findByIdAndUpdate(message.chat, {
			$set: { readBy: [message.user] },
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		let newMessage;

		if (message.type === "renameChat") {
			if (!message.newChatName) {
				return res
					.status(400)
					.json({ message: "newChatName is required for renameChat" });
			}
			newMessage = await RenameChatMessage.create({
				...message,
				user: user._id,
			});
		}

		if (message.type === "userMessage") {
			if (message.content.files.length === 0 && !message.content.markdown && message.content.gifs.length === 0) {
				return res
					.status(400)
					.json({ message: "Content is required for userMessage" });
			}
			newMessage = await UserMessage.create({
				...message,
				user: user._id,
			});
		}

		await Chat.findByIdAndUpdate(message.chat, {
			lastMessage: newMessage._id,
		});

		const messageWithUser = await Message.findById(newMessage._id)
			.populate("user")
			.populate({
				path: "replyTo",
				populate: { path: "user" },
			});

		EventEmitter.emit("new-message", messageWithUser);

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error", error });
	}
};

exports.getMessagesByChat = async (req, res) => {
	try {
		const { chatId, page } = req.params;
		const limit = 20;
		const currentPage = Number.parseInt(page, 10);

		await connectToDatabase();

		const messages = await Message.find({ chat: chatId })
			.sort({ createdAt: -1 })
			.skip((currentPage - 1) * limit)
			.limit(limit)
			.populate("user")
			.populate({
				path: "replyTo",
				populate: {
					path: "user",
				},
			});
		messages.reverse();

		const totalMessages = await Message.countDocuments({ chat: chatId });
		const hasNext = currentPage * limit < totalMessages;

		res.status(200).json({
			messages,
			hasNext,
			nextCursor: currentPage + 1,
			currentPage: page,
			totalMessages,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error", error });
	}
};

exports.deleteMessage = async (req, res) => {
	try {
		const { messageId, chatId } = req.body;
		await connectToDatabase();

		const deletedMessage = await Message.findByIdAndDelete(messageId);
		if (!deletedMessage) {
			return res.sendStatus(404);
		}

		const chat = await Chat.findById(chatId);
		if (chat?.lastMessage?.toString() === messageId) {
			const newLastMessage = await Message.findOne({ chat: chatId })
				.sort({ createdAt: -1 })
				.limit(1);

			await Chat.findByIdAndUpdate(chatId, {
				lastMessage: newLastMessage?._id || null,
			});
		}

		EventEmitter.emit("delete-message", { messageId, chatId });

		res.sendStatus(204);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", error });
	}
};

exports.editMessage = async (req, res) => {
	try {
		const { messageId } = req.params;
		const { markdown, chatId } = req.body;

		await connectToDatabase();
		const doc = await Message.findById(messageId);

		const message = await UserMessage.findByIdAndUpdate(messageId, {
			$set: { "content.markdown": markdown, edited: true },
		}, {new: true});

		if (!message) {
			res.status(404).json({ message: "Message not found" });
		}
		EventEmitter.emit("edit-message", { messageId, markdown, chatId });
		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error", error });
	}
};

exports.addReaction = async (req, res) => {
	try {
		const { messageId } = req.params;
		const { reaction } = req.body;

		await connectToDatabase();
		const message = await UserMessage.findByIdAndUpdate(messageId, {
			$addToSet: { reactions: reaction },
		});

		EventEmitter.emit("reaction", {
			reaction,
			chatId: message.chat.toString(),
			messageId,
		});

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error", error });
	}
};
