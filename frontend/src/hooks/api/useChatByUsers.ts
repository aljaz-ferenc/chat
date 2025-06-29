import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { fetchChatByUsers } from "../../../../shared/functions/api/fetchChatByUsers.ts";
import type { User } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useChatByUsers(otherUserId: User["_id"]) {
	const userId = useUserStore(useShallow((state) => state.user?._id));

	return useQuery({
		queryKey: ["chatByUsers"],
		queryFn: () => fetchChatByUsers(userId as string, otherUserId),
	});
}
