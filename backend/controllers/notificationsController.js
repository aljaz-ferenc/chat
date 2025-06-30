const User = require("../models/User");
const { connectToDatabase } = require("../models/mongoose");

exports.readNotification = async (req, res) => {
	try {
		const { userId } = req.body;
		await connectToDatabase();
		await User.findByIdAndUpdate(userId, {
			$set: { "notifications.opened": true },
		});

		res.status(203).json({ message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};

exports.deleteNotifications = async (req, res) => {
	try {
		console.log(req.body);
		const { userId } = req.body;
		const user = await User.findByIdAndUpdate(userId, {
			$set: { "notifications.notifications": [] },
		});

		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};
