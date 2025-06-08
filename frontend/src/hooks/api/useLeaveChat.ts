import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { fetchLeaveChat } from "../../../../shared/functions/api/fetchLeaveChat.ts";
import type { Chat, User } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useLeaveChat() {
	const userId = useUserStore(useShallow((state) => state.user?._id));
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["chat-leave"],
		mutationFn: async (chatId: Chat["_id"]) =>
			await fetchLeaveChat(chatId, userId as User["_id"]),
		onSuccess: async () =>
			await queryClient.invalidateQueries({ queryKey: ["chats"] }),
	});
}
