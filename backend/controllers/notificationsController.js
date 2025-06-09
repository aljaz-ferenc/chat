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
		console.log(error)
		return res.status(500).json({ message: "Server error" });
	}
};
