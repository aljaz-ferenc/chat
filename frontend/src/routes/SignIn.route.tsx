import { SignIn } from "@clerk/clerk-react";

export default function SignInRoute() {
	return (
		<div className="grid place-items-center h-full w-full bg-primary">
			<SignIn signUpUrl="/sign-up" />
		</div>
	);
}
