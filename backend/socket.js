const { Server } = require("socket.io");
const http = require("http");
const User = require("./models/User");

const onlineUsers = new Map();
let ioInstance = null;

function initSocket(app) {
	const server = http.createServer(app);

	ioInstance = new Server(server, {
		cors: {
			origin: process.env.FRONTEND_URL || "*",
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		},
	});

	ioInstance.on("connection", (socket) => {
		socket.on("online", async (userId) => {
			onlineUsers.set(userId, socket.id);

			const user = await User.findById(userId).select("chats");
			if (!user) return;

			for (const chatId of user.chats) {
				socket.join(chatId.toString());
			}
		});

		socket.on("typing", ({ isTyping, userId, chatId }) => {
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
	});

	return server; // <-- You should now use this server to start listening
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
