const { Server } = require("socket.io");
const http = require("node:http");
const { connectToDatabase } = require("./models/mongoose");
const User = require("./models/User");

const onlineUsers = new Map();
let io;

function initSocket(app) {
	const server = http.createServer(app);

	io = new Server(server, {
		cors: {
			origin: process.env.FRONTEND_URL || "http://localhost:5173",
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		},
	});

	io.on("connection", (socket) => {
		socket.on("online", async (userId) => {
			onlineUsers.set(userId, socket.id);
			await connectToDatabase();
			const user = await User.findById(userId).select("chats");
			for (const chatId of user.chats) {
				socket.join(chatId.toString());
			}
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

	return { server, io, onlineUsers };
}

module.exports = {
	initSocket,
	io: () => io,
	onlineUsers,
};
