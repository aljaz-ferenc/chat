const express = require("express");
const { clerkMiddleware } = require("@clerk/express");
const usersRouter = require("./routes/userRouter");
const friendRequestRouter = require("./routes/friendRequestRouter");
const notificationsRouter = require("./routes/notificationsRouter");
const contactsRouter = require("./routes/contactsRouter");
const chatsRouter = require("./routes/chatsRouter");
const messagesRouter = require("./routes/messagesRouter");
const webhooksRouter = require("./routes/webhooksRouter");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("node:http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
dotenv.config();
const onlineUsers = new Map();
const EventEmitter = require("./EventEmitter");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	},
});

const port = process.env.PORT || 3000;
const { connectToDatabase } = require("./models/mongoose");
const User = require("./models/User");

app.use(
	"/api/v1/webhooks/clerk",
	express.raw({ type: "application/json" }),
	webhooksRouter,
);

app.use(clerkMiddleware());
app.use(bodyParser.json());
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/friendRequest", friendRequestRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/contacts", contactsRouter);
app.use("/api/v1/chats", chatsRouter);
app.use("/api/v1/messages", messagesRouter);

io.on("connection", (socket) => {
	socket.removeAllListeners();
	socket.on("online", async (userId) => {
		console.log("ONLINE_USERS: ", onlineUsers);
		onlineUsers.set(userId, socket.id);
		await connectToDatabase();

		const user = await User.findById(userId).select("chats");
		if (!user) return;

		for (const chatId of user.chats) {
			socket.join(chatId.toString());
		}
	});

	socket.on("join-chat", (chatId) => {
		socket.join("join-chat", chatId);
	});

	socket.on("typing", ({ isTyping, userId, chatId }) => {
		io.to(chatId).emit("typing", { userId, isTyping });
	});

	socket.on("disconnect", () => {
		console.log("disconnect");
		for (const [userId, socketId] of onlineUsers.entries()) {
			if (socketId === socket.id) {
				onlineUsers.delete(userId);
				break;
			}
		}
	});
});

EventEmitter.on("new-message", (message) => {
	io.to(message.chat.toString()).emit("new-message", message);
});

EventEmitter.on("edit-message", ({ messageId, markdown, chatId }) => {
	io.to(chatId).emit("edit-message", { messageId, markdown });
});

EventEmitter.on("reaction", ({ reaction, chatId, messageId }) => {
	io.to(chatId).emit("reaction", { reaction, chatId, messageId });
});

EventEmitter.on("added-to-group", ({ usersIds, chatId }) => {
	for (const userId of usersIds) {
		const socketId = onlineUsers.get(userId);
		console.log(socketId);
		if (socketId) {
			const socket = io.sockets.sockets.get(socketId);
			socket.join(chatId);
			io.to(chatId).emit("added-to-group", chatId);
		}
	}
});

EventEmitter.on("delete-message", ({ messageId, chatId, lastMessageId }) => {
	io.to(chatId).emit("delete-message", {
		messageId,
		chatId,
		lastMessageId,
	});
});

EventEmitter.on("chat-rename", (renameMessage) => {
	io.to(renameMessage.chat.toString()).emit("chat-rename", renameMessage);
});

EventEmitter.on("user-left", ({ chatId, userId }) => {
	const socketId = onlineUsers.get(userId);
	if (socketId) {
		const socket = io.sockets.sockets.get(socketId);
		socket.leave(chatId);

		io.to(chatId).emit("user-left", { chatId, userId });
	}
});

EventEmitter.on("create-chat", ({ userId, chatId }) => {
	const socketId = onlineUsers.get(userId);
	if (socketId) {
		const socket = io.sockets.sockets.get(socketId);
		socket.join(chatId);
	}
});

EventEmitter.on("friendRequest-incoming", (receiverId) => {
	const receiverSocketId = onlineUsers.get(receiverId);
	io.to(receiverSocketId).emit("friendRequest-incoming");
});

EventEmitter.on("friendRequest-declined", ({ receiverId, senderId }) => {
	const receiverSocketId = onlineUsers.get(receiverId);
	io.to(receiverSocketId).emit("friendRequest-declined", {
		from: senderId,
	});
});

EventEmitter.on("friendRequest-accepted", ({ receiverId, senderId }) => {
	const receiverSocketId = onlineUsers.get(receiverId);
	const senderSocketId = onlineUsers.get(senderId);
	io.to(receiverSocketId).emit("friendRequest-accepted", {
		from: senderId,
	});

	io.to(senderSocketId).emit("friendRequest-accepted", {
		from: senderId,
	});
});

EventEmitter.on("friendRequest-canceled", ({ senderId, receiverId }) => {
	const receiverSocketId = onlineUsers.get(receiverId);
	const senderSocketId = onlineUsers.get(senderId);

	io.to(receiverSocketId).emit("friendRequest-canceled", {
		from: senderId,
	});

	io.to(senderSocketId).emit("friendRequest-canceled", {
		from: senderId,
	});
});

EventEmitter.on("friendRequest-unfriended", ({ senderId, receiverId }) => {
	const receiverSocketId = onlineUsers.get(receiverId);

	io.to(receiverSocketId).emit("friendRequest-unfriended", {
		from: senderId,
	});
});

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
