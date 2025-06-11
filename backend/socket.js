const { Server } = require("socket.io");
const http = require("http");
const User = require("./models/User");
const { connectToDatabase } = require("./models/mongoose");
const Emitter = require("node:events");
const EventEmitter = new Emitter();

const onlineUsers = new Map();
let ioInstance = null;

function initSocket(app) {
	const server = http.createServer(app);

	if (!ioInstance) {
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
			console.log(`Came online: ${userId} ${socket.id}`);
			await connectToDatabase();

			const user = await User.findById(userId).select("chats");
			if (!user) return;

			for (const chatId of user.chats) {
				socket.join(chatId.toString());
			}
		});

		socket.on("join-chat", (chatId) => {
			socket.join(chatId);
			console.log(`Socket ${socket.id} joined chat ${chatId}`);
		});

		socket.on("typing", ({ isTyping, userId, chatId }) => {
			console.log("received event: typing");
			ioInstance.to(chatId).emit("typing", { userId, isTyping });
			console.log(
				`CLIENTS in room ${chatId}: `,
				ioInstance.sockets.adapter.rooms.get(chatId),
			);
		});

		socket.on("new-message", (message) => {
			console.log("received event: new-message in socket.js");
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

	return server;
}

EventEmitter.on("new-message", (message) => {
	console.log("Emitter: new-message");
	console.log(message.chat.toString());
	ioInstance.to(message.chat.toString()).emit("new-message", message);
	// console.log(
	// 	`CLIENTS in room ${message.chat.toString()}: `,
	// 	ioInstance.sockets.adapter.rooms.get(message.chat.toString()),
	// );
});

function getIO() {
	if (!ioInstance) {
		throw new Error("Socket.io not initialized. Call initSocket() first.");
	}
	return ioInstance;
}

function emitEvent(to, event, data) {
	// ioInstance.to(to).emit(event, data);
	console.log("Emitted event: ", event);
}

module.exports = {
	initSocket,
	getIO,
	onlineUsers,
	emitEvent,
	EventEmitter,
};
