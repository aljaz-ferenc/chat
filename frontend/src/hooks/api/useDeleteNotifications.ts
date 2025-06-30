import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { fetchDeleteNotifications } from "../../../../shared/functions/api/fetchDeleteNotifications.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useDeleteNotifications() {
	const userId = useUserStore(useShallow((state) => state.user?._id));
	const queryClient = useQueryClient();
	const { user } = useUser();

	return useMutation({
		mutationKey: ["notifications-delete"],
		mutationFn: async () => await fetchDeleteNotifications(userId as string),
		onSuccess: async () =>
			await queryClient.invalidateQueries({
				queryKey: ["users", { clerkId: user?.id }],
			}),
	});
}
