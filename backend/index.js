const express = require("express");
const { clerkMiddleware } = require("@clerk/express");
const usersRouter = require("./routes/userRouter");
const friendRequestRouter = require("./routes/friendRequestRouter");
const notificationsRouter = require("./routes/notificationsRouter");
const contactsRouter = require("./routes/contactsRouter");
const chatsRouter = require("./routes/chatsRouter");
const messagesRouter = require("./routes/messagesRouter");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const { initSocket } = require("./socket");
const { server } = initSocket(app);

app.use(clerkMiddleware());
app.use(bodyParser.json());
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/friendRequest", friendRequestRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/contacts", contactsRouter);
app.use("/api/v1/chats", chatsRouter);
app.use("/api/v1/messages", messagesRouter);

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
