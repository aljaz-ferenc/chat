import {createBrowserRouter, RouterProvider as Provider} from "react-router";
import SignInRoute from "../routes/SignIn.route.tsx";
import SignUpRoute from "../routes/SignUp.route.tsx";
import ChatRoute from "../routes/ChatRoute.tsx";
import RootLayout from "../layouts/RootLayout.tsx";

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
                element: <ChatRoute/>,
            },
        ],
    },
])

export default function RouterProvider() {
    return <Provider router={router}/>
}