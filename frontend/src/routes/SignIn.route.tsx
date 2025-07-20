import { SignIn } from "@clerk/clerk-react";

export default function SignInRoute() {
	return (
		<div className="grid place-items-center h-screen w-full bg-primary">
			<SignIn signUpUrl="/sign-up" withSignUp={false} />
		</div>
	);
}
