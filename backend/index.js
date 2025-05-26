const express = require("express");
const { clerkMiddleware } = require("@clerk/express");
const usersRouter = require("./routes/userRouter");
const friendRequestRouter = require("./routes/friendRequestRouter");
const notificationsRouter = require("./routes/notificationsRouter");
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

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
