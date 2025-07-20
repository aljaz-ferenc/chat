import { SignUp } from "@clerk/clerk-react";

export default function SignUpRoute() {
	return (
		<div className="grid place-items-center w-full h-screen bg-primary">
			<SignUp signInUrl="/" />
		</div>
	);
}
