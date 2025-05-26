import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { fetchFriendRequest } from "../../../../shared/functions/api/fetchFriendRequest.ts";
import type { FriendRequestAction } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useFriendRequest() {
	const [userId, clerkId] = useUserStore(
		useShallow((state) => [state.user?._id, state.user?.clerkId]),
	);
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["friendRequest"],
		mutationFn: ({
			receiverId,
			action,
		}: { receiverId: string; action: FriendRequestAction }) => {
			return fetchFriendRequest(userId as string, receiverId, action);
		},
		onSettled: async () =>
			await queryClient.invalidateQueries({ queryKey: ["users", { clerkId }] }),
	});
}
