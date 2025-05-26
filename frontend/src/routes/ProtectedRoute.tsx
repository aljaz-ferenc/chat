import { ClerkLoading, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import type { PropsWithChildren } from "react";

export default function ProtectedRoute({ children }: PropsWithChildren) {
	const { isLoaded, isSignedIn } = useAuth();
	if (!isLoaded) {
		return <ClerkLoading />;
	}

	if (!isSignedIn) {
		return <RedirectToSignIn />;
	}

	return <>{children}</>;
}
