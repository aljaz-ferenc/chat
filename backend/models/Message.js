const { mongoose } = require("mongoose");

const baseMessageSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
		},
		chat: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Chat",
		},
	},
	{
		timestamps: true,
		discriminatorKey: "type",
	},
);

const Message =
	mongoose.models.Message || mongoose.model("Message", baseMessageSchema);

const RenameChatMessage = Message.discriminator(
	"renameChat",
	new mongoose.Schema({
		newChatName: {
			type: String,
			required: [true, "newChatName is required"],
		},
	}),
);

const LeaveChatMessage = Message.discriminator(
	"leaveChat",
	new mongoose.Schema({}),
);

const UserMessage = Message.discriminator(
	"userMessage",
	new mongoose.Schema({
		edited: {
			type: Boolean,
			default: false,
		},
		reactions: [
			{
				emoji: String,
				by: String,
			},
		],
		replyTo: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Message",
			default: null,
		},
		content: {
			markdown: String,
			files: {
				type: [String],
			},
		},
	}),
);

module.exports = {
	Message,
	RenameChatMessage,
	UserMessage,
	LeaveChatMessage,
};
