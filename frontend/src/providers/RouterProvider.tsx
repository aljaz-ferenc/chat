import { RouterProvider as Provider, createBrowserRouter } from "react-router";
import Contact from "../components/Contact.tsx";
import Messages from "../components/Messages.tsx";
import SearchUsers from "../components/SearchUsers.tsx";
import ChatLayout from "../layouts/ChatLayout.tsx";
import ContactsLayout from "../layouts/ContactsLayout.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import ProtectedRoute from "../routes/ProtectedRoute.tsx";
import SignInRoute from "../routes/SignIn.route.tsx";
import SignUpRoute from "../routes/SignUp.route.tsx";

const router = createBrowserRouter([
	{
		path: "/sign-in",
		element: <SignInRoute />,
	},
	{
		path: "sign-up",
		element: <SignUpRoute />,
	},
	{
		path: "/",
		element: (
			<ProtectedRoute>
				{" "}
				<RootLayout />
			</ProtectedRoute>
		),
		children: [
			{
				path: "chat",
				element: <ChatLayout />,
				children: [
					{
						path: ":id",
						element: <Messages />,
					},
				],
			},
			{
				path: "contacts",
				element: <ContactsLayout />,
				children: [
					{
						index: true,
						element: <SearchUsers />,
					},
					{
						path: ":contactId",
						element: <Contact />,
					},
				],
			},
		],
	},
]);

export default function RouterProvider() {
	return <Provider router={router} />;
}
