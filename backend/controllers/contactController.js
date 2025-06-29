const User = require("../models/User");
const { connectToDatabase } = require("../models/mongoose");
const mongoose = require("mongoose");

exports.getContact = async (req, res) => {
	try {
		const { userId, contactId } = req.params;
		await connectToDatabase();

		const objectUserId = new mongoose.Types.ObjectId(userId);
		const objectContactId = new mongoose.Types.ObjectId(contactId);

		const user = await User.findById(userId);
		const contact = await User.findById(contactId);

		const userFriendIds = user.friends.friends.map((id) => id.toString());
		const contactFriendIds = contact.friends.friends.map((id) => id.toString());

		const mutualFriendIds = userFriendIds.filter((id) =>
			contactFriendIds.includes(id),
		);

		const mutualFriends = await User.find({
			_id: { $in: mutualFriendIds },
		}).select("firstName lastName username imageUrl");

		return res.status(200).json({ ...contact._doc, mutualFriends });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};

exports.getContacts = async (req, res) => {
	const { userId } = req.params;

	await connectToDatabase();

	try {
		const result = await User.aggregate([
			{
				$match: { _id: new mongoose.Types.ObjectId(userId) },
			},
			{
				$lookup: {
					from: "users",
					localField: "friends.friends",
					foreignField: "_id",
					as: "contacts",
				},
			},
			{
				$project: {
					contacts: 1,
				},
			},
		]);

		if (!result.length) {
			return res.status(404).json({ message: "Contacts not found" });
		}

		res.status(200).json(result[0].contacts);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
};
