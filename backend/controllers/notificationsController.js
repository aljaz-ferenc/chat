const User = require("../models/user");
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
		return res.status(500).json({ message: "Server error" });
	}
};
