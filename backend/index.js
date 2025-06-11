const express = require("express");
const { clerkMiddleware } = require("@clerk/express");
const usersRouter = require("./routes/userRouter");
const friendRequestRouter = require("./routes/friendRequestRouter");
const notificationsRouter = require("./routes/notificationsRouter");
const contactsRouter = require("./routes/contactsRouter");
const chatsRouter = require("./routes/chatsRouter");
const messagesRouter = require("./routes/messagesRouter");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("node:http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
dotenv.config();
const onlineUsers = new Map();
const EventEmitter = require("./EventEmitter");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_URL || "*",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	},
});
const port = process.env.PORT || 3000;
const { initSocket } = require("./socket");
const { connectToDatabase } = require("./models/mongoose");
const User = require("./models/User");

app.use(cors());
app.use(clerkMiddleware());
app.use(bodyParser.json());
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/friendRequest", friendRequestRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/contacts", contactsRouter);
app.use("/api/v1/chats", chatsRouter);
app.use("/api/v1/messages", messagesRouter);

io.on("connection", (socket) => {
	console.log("connection, ", socket.id);
	socket.on("online", async (userId) => {
		console.log("ONLINE_USERS: ", onlineUsers);
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
		io.to(chatId).emit("typing", { userId, isTyping });
		console.log(
			`CLIENTS in room ${chatId}: `,
			io.sockets.adapter.rooms.get(chatId),
		);
	});

	socket.on("new-message", (message) => {
		console.log("received event: new-message in socket.js");
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
	console.log("new-message from emitter: ", message);
	io.to(message.chat.toString()).emit("new-message", message);
});

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
