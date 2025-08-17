import DemoUserCredentials from "@/components/auth/DemoUserCredentials.tsx";
import { SignIn } from "@clerk/clerk-react";

const showDemoUserCredentials = import.meta.env.VITE_SHOW_DEMO_USER_CREDENTIALS;

export default function SignInRoute() {
	return (
		<div className="grid place-items-center h-screen w-full bg-primary">
			<div className="flex flex-col gap-4">
				<SignIn signUpUrl="/sign-up" withSignUp={false} />
				{showDemoUserCredentials && <DemoUserCredentials />}
			</div>
		</div>
	);
}
