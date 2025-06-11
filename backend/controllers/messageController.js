const { connectToDatabase } = require("../models/mongoose");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { getIO, emitEvent } = require("../socket");
const EventEmitter = require("../EventEmitter");

exports.createMessage = async (req, res) => {
	try {
		console.log("AAAAAAAAAAAA");
		const { message } = req.body;
		await connectToDatabase();
		const newMessage = await Message.create(message);
		await Chat.findByIdAndUpdate(message.chat, {
			lastMessage: newMessage._id,
		});

		const messageWithUser = await Message.findById(newMessage._id)
			.populate({
				path: "user",
			})
			.populate({ path: "replyTo", populate: { path: "user" } });
		// const io = getIO();
		// io.to(message.chat.toString()).emit("new-message", messageWithUser);
		// emitEvent(message.chat.toString(), "new-message", messageWithUser)
		// console.log('new-message')
		EventEmitter.emit("new-message", messageWithUser);

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error", error });
	}
};

exports.getMessagesByChat = async (req, res) => {
	try {
		const { chatId } = req.params;
		await connectToDatabase();
		const messages = await Message.find({ chat: chatId })
			.populate("user")
			.populate({
				path: "replyTo",
				populate: {
					path: "user",
				},
			});

		res.status(200).json(messages);
	} catch (error) {
		console.log(error);
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

		if (lastMessageId && messageId === lastMessageId) {
			await Chat.findByIdAndUpdate(chatId, {
				lastMessage: new mongoose.Types.ObjectId(lastMessageId),
			});
		}
		const io = getIO();
		io.to(chatId).emit("delete-message", { messageId, chatId, lastMessageId });

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
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
		const io = getIO();
		io.to(chatId).emit("edit-message", { messageId, markdown });
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
		const message = await Message.findByIdAndUpdate(messageId, {
			$addToSet: { reactions: reaction },
		});
		const io = getIO();
		io.to(message.chat.toString()).emit("reaction", {
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
