const { onlineUsers } = require("../socket");

exports.isOnline = (userId) => {
	return onlineUsers().has(userId);
};
