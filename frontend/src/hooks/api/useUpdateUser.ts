import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { fetchUpdateUser } from "../../../../shared/functions/api/fetchUpdateUser.ts";
import type { User } from "../../../../shared/types.ts";

export default function useUpdateUser() {
	const { userId } = useAuth();

	return useMutation({
		mutationKey: ["user-update"],
		mutationFn: async (updates: Partial<User>) => {
			await fetchUpdateUser(userId as User['_id'], updates);
		},
	});
}
