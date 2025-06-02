const { mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
		},
		chat: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Chat",
		},
		content: {
			markdown: String,
		},
	},
	{ timestamps: true },
);

module.exports =
	mongoose.models.Message || mongoose.model("Message", messageSchema);
