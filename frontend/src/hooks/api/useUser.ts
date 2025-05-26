import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { fetchUser } from "../../../../shared/functions/api/fetchUser.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useUser() {
	const { userId: clerkId } = useAuth();
	const setUser = useUserStore(useShallow((state) => state.setUser));

	const query = useQuery({
		queryKey: ["users", { clerkId }],
		queryFn: () => fetchUser(clerkId as string),
		enabled: !!clerkId,
	});

	useEffect(() => {
		if (query.data) {
			setUser(query.data);
		}
	}, [query.data, setUser]);

	return query;
}
