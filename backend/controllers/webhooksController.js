const { verifyWebhook } = require("@clerk/express/webhooks");
const User = require("../models/User");

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
console.log("WEBHOOK_SECRET: ", WEBHOOK_SECRET);

exports.users = async (req, res) => {
	// console.log("REQ: ", req);
	try {
		const evt = await verifyWebhook(req);

		console.log("EVT: ", evt);

		const { data } = evt;

		if (evt.type === "user.created") {
			const primaryEmail = data.email_addresses.find(
				(e) => e.id === data.primary_email_address_id,
			)?.email_address;

			const newUser = await User.create({
				clerkId: data.id,
				firstName: data.first_name,
				lastName: data.last_name,
				email: primaryEmail,
				username: data.username,
				imageUrl: data.image_url,
			});

			console.log("New user created:", newUser);
		}

		if (evt.type === "user.updated") {
			const primaryEmail = data.email_addresses.find(
				(e) => e.id === data.primary_email_address_id,
			)?.email_address;

			const updatedUser = await User.findOneAndUpdate(
				{ clerkId: data.id },
				{
					firstName: data.first_name,
					lastName: data.last_name,
					email: primaryEmail,
					username: data.username,
					imageUrl: data.image_url,
				},
				{ new: true },
			);

			console.log("User updated:", updatedUser);
		}

		if (evt.type === "user.deleted") {
			const deletedUser = await User.findOneAndDelete({ clerkId: data.id });

			console.log("User deleted:", deletedUser);
		}

		res.send("Webhook received");
	} catch (error) {
		console.error("Webhook error:", error);
		res.status(500).json({ message: "Server error" });
	}
};
