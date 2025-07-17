import ThemeProvider from "@/providers/ThemeProvider.tsx";
import type { PropsWithChildren, ReactNode } from "react";
import ClerkProviderComponent from "./ClerkProvider.tsx";
import FileStorageProvider from "./FileStorageProvider.tsx";
import ReactQueryProvider from "./ReactQueryProvider.tsx";
import RouterProvider from "./RouterProvider.tsx";
import SocketProvider from "./SocketProvider.tsx";

type ProviderProps = {} & PropsWithChildren;

const composeProviders = (
	providers: React.FC<{
		children: ReactNode;
	}>[],
) => {
	if (!providers?.length) {
		return ({
			children,
		}: {
			children?: ReactNode;
		}) => children;
	}

	return providers.reduce((Prev, Curr) => ({ children }) => {
		if (Prev) {
			return (
				<Prev>
					<Curr>{children}</Curr>
				</Prev>
			);
		}

		return <Curr>{children}</Curr>;
	});
};

const Providers = composeProviders([
	ReactQueryProvider,
	ClerkProviderComponent,
	SocketProvider,
	ThemeProvider,
	RouterProvider,
	FileStorageProvider,
]);

export default function Provider({ children }: ProviderProps) {
	return <Providers>{children}</Providers>;
}
