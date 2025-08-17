import DemoUserCredentials from "@/components/auth/DemoUserCredentials.tsx";
import { SignIn } from "@clerk/clerk-react";

const showDemoUserCredentials = import.meta.env.VITE_SHOW_DEMO_USER_CREDENTIALS;

const demoUsers = {
	user1: {
		username: import.meta.env.VITE_DEMO_USER_1_USERNAME as string,
		password: import.meta.env.VITE_DEMO_USER_1_PASSWORD as string,
	},
	user2: {
		username: import.meta.env.VITE_DEMO_USER_2_USERNAME as string,
		password: import.meta.env.VITE_DEMO_USER_2_PASSWORD as string,
	},
} as const;

export default function SignInRoute() {
	return (
		<div className="grid place-items-center h-screen w-full bg-primary">
			<div className="flex flex-col gap-4">
				<SignIn signUpUrl="/sign-up" withSignUp={false} />
				{showDemoUserCredentials && (
					<>
						<DemoUserCredentials creds={demoUsers.user1} />
						<DemoUserCredentials creds={demoUsers.user2} />
					</>
				)}
			</div>
		</div>
	);
}
