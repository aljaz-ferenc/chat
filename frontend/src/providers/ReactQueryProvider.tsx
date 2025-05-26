import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 3,
			refetchOnMount: true,
			refetchOnWindowFocus: true,
			gcTime: 0,
			staleTime: 0,
		},
	},
});

type ReactQueryProviderProps = {} & PropsWithChildren;

export default function ReactQueryProvider({
	children,
}: ReactQueryProviderProps) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
