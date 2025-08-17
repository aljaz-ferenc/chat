import DemoUserCredentials from "@/components/auth/DemoUserCredentials.tsx";
import { SignIn } from "@clerk/clerk-react";

const showDemoUserCredentials = import.meta.env.VITE_SHOW_DEMO_USER_CREDENTIALS;

const demoUsers = {
	user1: {
		username: import.meta.env.VITE_DEMO_USER_1_USERNAME as string,
		password: import.meta.env.VITE_DEMO_USER_1_PASSWORD as string,
		name: "DEMO USER 1",
	},
	user2: {
		username: import.meta.env.VITE_DEMO_USER_2_USERNAME as string,
		password: import.meta.env.VITE_DEMO_USER_2_PASSWORD as string,
		name: "DEMO USER 2",
	},
} as const;

export default function SignInRoute() {
	return (
		<div className="grid place-items-center min-h-screen w-full bg-primary py-5">
			<div className="flex flex-col gap-4 md:gap-10 items-center">
				<SignIn signUpUrl="/sign-up" withSignUp={false} />
				{showDemoUserCredentials && (
					<div className="w-[250px] md:w-full flex flex-col md:gap-10 gap-5 mx-auto md:flex-row">
						<DemoUserCredentials creds={demoUsers.user1} />
						<DemoUserCredentials creds={demoUsers.user2} />
					</div>
				)}
			</div>
		</div>
	);
}
