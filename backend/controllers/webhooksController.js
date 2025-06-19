const { verifyWebhook } = require("@clerk/express/webhooks");
const User = require("../models/User");

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

exports.users = async (req, res) => {
	try {
		const evt = await verifyWebhook({
			req,
			secret: WEBHOOK_SECRET,
		});

		if (evt.type === "user.created") {
			const { data } = evt;

			const primaryEmail = data.email_addresses.find(
				(e) => e.id === data.primary_email_address_id,
			)?.email_address;

			const newUser = await User.create({
				clerkId: data.id,
				firstName: data.first_name,
				lastName: data.last_name,
				email: primaryEmail,
				username: data.username,
			});

			console.log("New user created:", newUser);
		}

		return res.send("Webhook received");
	} catch (error) {
		console.error("Webhook error:", error);
		res.status(500).json({ message: "Server error" });
	}
};
