import {createBrowserRouter, RouterProvider as Provider} from "react-router";
import SignInRoute from "../routes/SignIn.route.tsx";
import SignUpRoute from "../routes/SignUp.route.tsx";
import ChatLayout from "../layouts/ChatLayout.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import Messages from "../components/Messages.tsx";
import ContactsLayout from "../layouts/ContactsLayout.tsx";
import SearchUsers from "../components/SearchUsers.tsx";
import Contact from "../components/Contact.tsx";

const router = createBrowserRouter([
    {
        path: '/sign-in',
        element: <SignInRoute/>,
    },
    {
        path: 'sign-up',
        element: <SignUpRoute/>,
    },
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {
                path: 'chat',
                element: <ChatLayout/>,
                children: [
                    {
                        path: ':id',
                        element: <Messages/>
                    }
                ]
            },
            {
                path: 'contacts',
                element: <ContactsLayout/>,
                children: [
                    {
                        index: true,
                        element: <SearchUsers/>,
                    },
                    {
                        path: ':id',
                        element: <Contact/>
                    }
                ]
            },
        ],
    },
])

export default function RouterProvider() {
    return <Provider router={router}/>
}