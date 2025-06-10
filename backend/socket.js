const { Server } = require("socket.io");
const http = require("http");
const User = require("./models/User");
const {connectToDatabase} = require("./models/mongoose");

const onlineUsers = new Map();
let ioInstance = null;

function initSocket(app) {
	const server = http.createServer(app);

	if(!ioInstance){
		ioInstance = new Server(server, {
			cors: {
				origin: process.env.FRONTEND_URL || "*",
				methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
			},
		});
	}

	ioInstance.on("connection", (socket) => {
		socket.on("online", async (userId) => {
			onlineUsers.set(userId, socket.id);
			await connectToDatabase()

			const user = await User.findById(userId).select("chats");
			if (!user) return;

			for (const chatId of user.chats) {
				socket.join(chatId.toString());
			}
		});

		socket.on("typing", ({ isTyping, userId, chatId }) => {
			console.log('received event: typing')
			ioInstance.to(chatId).emit("typing", { userId, isTyping });
		});

		socket.on("disconnect", () => {
			for (const [userId, socketId] of onlineUsers.entries()) {
				if (socketId === socket.id) {
					onlineUsers.delete(userId);
					break;
				}
			}
		});

		socket.on("join-chat", (chatId) => {
			socket.join(chatId);
			console.log(`Socket ${socket.id} joined chat ${chatId}`);
		});
	});

	return server;
}

function getIO() {
	if (!ioInstance) {
		throw new Error("Socket.io not initialized. Call initSocket() first.");
	}
	return ioInstance;
}

module.exports = {
	initSocket,
	getIO,
	onlineUsers,
};
