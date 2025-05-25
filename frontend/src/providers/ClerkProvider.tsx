import { ClerkProvider } from "@clerk/clerk-react";
import type { PropsWithChildren } from "react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

type ClerkProviderComponentProps = {} & PropsWithChildren;

export default function ClerkProviderComponent({
                                                   children,
                                               }: ClerkProviderComponentProps) {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>{children}</ClerkProvider>
    );
}