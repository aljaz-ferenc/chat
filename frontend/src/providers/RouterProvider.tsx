import { RouterProvider as Provider, createBrowserRouter } from "react-router";
import { Routes } from "../../../shared/Routes.enum.ts";
import Profile from "../components/Profile.tsx";
import SearchUsers from "../components/SearchUsers.tsx";
import Messages from "../components/chat/Messages.tsx";
import Contact from "../components/contacts/Contact.tsx";
import ChatLayout from "../layouts/ChatLayout.tsx";
import ContactsLayout from "../layouts/ContactsLayout.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import ProtectedRoute from "../routes/ProtectedRoute.tsx";
import SignInRoute from "../routes/SignIn.route.tsx";
import SignUpRoute from "../routes/SignUp.route.tsx";

const router = createBrowserRouter([
	{
		path: Routes.SIGN_IN,
		element: <SignInRoute />,
	},
	{
		path: Routes.SIGN_UP,
		element: <SignUpRoute />,
	},
	{
		path: Routes.PROFILE,
		element: <Profile />,
	},
	{
		path: Routes.HOME,
		element: (
			<ProtectedRoute>
				{" "}
				<RootLayout />
			</ProtectedRoute>
		),
		children: [
			{
				path: Routes.CHATS,
				element: <ChatLayout />,
				children: [
					{
						path: ":chatId",
						element: <Messages />,
					},
				],
			},
			{
				path: Routes.CONTACTS,
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
