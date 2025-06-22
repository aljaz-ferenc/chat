const User = require("../models/User");
const { connectToDatabase } = require("../models/mongoose");

exports.getAllUsers = async (req, res) => {
	try {
		await connectToDatabase();
		const users = await User.find();

		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};

exports.getUser = async (req, res) => {
	try {
		const { clerkId } = req.params;
		await connectToDatabase();
		const user = await User.findOne({ clerkId })
			.populate(
				"friends.pendingRequests friends.incomingRequests friends.friends friends.blocked notifications.notifications.from notifications.notifications.type",
			)
			.populate({ path: "notifications.notifications.from" });

		res.status(200).json(user);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};

exports.searchUsers = async (req, res) => {
	try {
		const { query } = req.params;
		await connectToDatabase();
		const users = await User.aggregate([
			{
				$match: {
					$or: [
						{ firstName: { $regex: query, $options: "i" } },
						{ lastName: { $regex: query, $options: "i" } },
						{ username: { $regex: query, $options: "i" } },
					],
				},
			},
			{
				$project: {
					firstName: 1,
					lastName: 1,
					username: 1,
					_id: 1,
				},
			},
		]);

		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const { clerkId } = req.params;
		const { updates } = req.body;
		const user = await User.findOneAndUpdate({ clerkId }, updates);

		if (!user) return res.status(404).json({ message: "User not found" });
		return res.status(200).json(user);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};
