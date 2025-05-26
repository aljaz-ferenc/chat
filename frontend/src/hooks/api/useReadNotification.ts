import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import fetchReadNotification from "../../../../shared/functions/api/fetchReadNotification.ts";
import type { User } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useReadNotification() {
	const [userId, clerkId] = useUserStore(
		useShallow((state) => [state.user?._id, state.user?.clerkId]),
	);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["notification", { action: "read" }],
		mutationFn: () => fetchReadNotification(userId as User["_id"]),
		onSuccess: async () =>
			await queryClient.invalidateQueries({
				queryKey: ["users", { userId: clerkId }],
			}),
	});
}
