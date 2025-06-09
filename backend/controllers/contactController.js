const User = require("../models/User");
const { connectToDatabase } = require("../models/mongoose");
const mongoose = require("mongoose");

exports.getContact = async (req, res) => {
	try {
		const { userId, contactId } = req.params;
		await connectToDatabase();

		const objectUserId = new mongoose.Types.ObjectId(userId);
		const objectContactId = new mongoose.Types.ObjectId(contactId);

		const result = await User.aggregate([
			{ $match: { _id: objectContactId } },
			{
				$lookup: {
					from: "users",
					localField: "friends.friends",
					foreignField: "_id",
					as: "contactFriends",
				},
			},
			{
				$lookup: {
					from: "users",
					let: { userId: objectUserId },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
						{
							$project: {
								friendsList: "$friends.friends",
							},
						},
					],
					as: "userDoc",
				},
			},
			{ $unwind: "$userDoc" },
			{
				$addFields: {
					mutualFriends: {
						$setIntersection: ["$userDoc.friendsList", "$friends.friends"],
					},
				},
			},
			{
				$project: {
					userDoc: 0,
					// mutualFriendIds: 0,
					contactFriends: 0,
				},
			},
		]);

		if (!result.length) {
			return res.status(404).json({ message: "Contact not found" });
		}

		return res.status(200).json(result[0]);
	} catch (error) {
		console.log(error)
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
