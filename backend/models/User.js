const mongoose = require("mongoose");

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
            pendingRequests: [{ type: String, ref: "User", default: [] }],
            blocked: [{ type: String, ref: "User", default: [] }],
        },
    },
    { timestamps: true },
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = UserModel
