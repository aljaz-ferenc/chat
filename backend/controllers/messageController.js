const { connectToDatabase } = require("../models/mongoose");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { io } = require("../socket");

exports.createMessage = async (req, res) => {
	try {
		const { message } = req.body;
		await connectToDatabase();
		const newMessage = await Message.create(message);
		await Chat.findByIdAndUpdate(message.chat, {
			lastMessage: newMessage._id,
		});

		io().to(message.chat).emit("new-message", newMessage);

		res.sendStatus(204);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.getMessagesByChat = async (req, res) => {
	try {
		const { chatId } = req.params;
		const messages = await Message.find({ chat: chatId });

		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.deleteMessage = async (req, res) => {
	try {
		const { messageId, chatId, lastMessageId } = req.body;
		await connectToDatabase();
		const deletedMessage = await Message.findByIdAndDelete(messageId);

		if (!deletedMessage) {
			return res.sendStatus(404);
		}

		console.log("LAST_MESSAGE_ID: ", lastMessageId);

		if (lastMessageId && messageId === lastMessageId) {
			await Chat.findByIdAndUpdate(chatId, {
				lastMessage: new mongoose.Types.ObjectId(lastMessageId),
			});
		}

		io()
			.to(chatId)
			.emit("delete-message", { messageId, chatId, lastMessageId });

		res.sendStatus(204);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.editMessage = async (req, res) => {
	try {
		const { messageId } = req.params;
		const { markdown, chatId } = req.body;

		await connectToDatabase();
		const message = await Message.findByIdAndUpdate(messageId, {
			$set: { "content.markdown": markdown, edited: true },
		});

		if (!message) {
			res.status(404).json({ message: "Message not found" });
		}

		io().to(chatId).emit("edit-message", { messageId, markdown });
		res.sendStatus(204);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.addReaction = async (req, res) => {
	try {
		const { messageId } = req.params;
		const { reaction } = req.body;

		await connectToDatabase();
		const message = await Message.findByIdAndUpdate(messageId, {
			$addToSet: { reactions: reaction },
		});

		io().to(message.chat.toString()).emit("reaction", {reaction, chatId: message.chat.toString(), messageId});

		res.sendStatus(204);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};