import {SignIn} from "@clerk/clerk-react";

export default function SignInRoute() {
    return (
        <SignIn signUpUrl="/sign-up"/>
    )
}