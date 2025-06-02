const { connectToDatabase } = require("../models/mongoose");
const Message = require("../models/Message");
const { io } = require("../socket");

exports.createMessage = async (req, res) => {
	try {
		const { message } = req.body;
		await connectToDatabase();
		const newMessage = await Message.create(message);

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
