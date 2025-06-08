const { mongoose } = require("mongoose");

const chatSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["single", "group"],
			required: [true, "type is required"],
		},
		users: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: "User",
			},
		],
		lastMessage: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Message",
		},
		name: {
			type: String,
		},
	},
	{ timestamps: true },
);

const ChatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
module.exports = ChatModel;
