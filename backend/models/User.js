const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
	read: {
		type: Boolean,
		required: [true, "notification read status is required"],
		default: false,
	},
	type: {
		type: String,
		enum: ["friendRequest"],
		required: [true, "notification type is required"],
	},
	from: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "User",
	},
});

const userSchema = new mongoose.Schema(
	{
		clerkId: {
			type: String,
			required: [true, "clerkId is required"],
			unique: [true, "clerkId already exists"],
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: [true, "email is required"],
			trim: true,
			unique: [true, "email already exists"],
		},
		friends: {
			incomingRequests: [
				{ type: mongoose.SchemaTypes.ObjectId, ref: "User", default: [] },
			],
			pendingRequests: [
				{ type: mongoose.SchemaTypes.ObjectId, ref: "User", default: [] },
			],
			blocked: [{ type: String, ref: "User", default: [] }],
			friends: [
				{ type: mongoose.SchemaTypes.ObjectId, ref: "User", default: [] },
			],
		},
		notifications: {
			notifications: [NotificationSchema],
			opened: {
				type: Boolean,
				required: [true, "opened status is required"],
				default: true,
			},
		},
	},
	{ timestamps: true },
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = UserModel;
