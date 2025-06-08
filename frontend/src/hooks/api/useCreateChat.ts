import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { fetchCreateChat } from "../../../../shared/functions/api/fetchCreateChat.ts";
import type { Chat, User } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useCreateChat() {
	const userId = useUserStore(useShallow((state) => state.user?._id));
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["chat-create"],
		mutationFn: async (chatType: Chat["type"]) =>
			await fetchCreateChat(userId as User["_id"], chatType),
		onSuccess: async () =>
			await queryClient.invalidateQueries({ queryKey: ["chats"] }),
	});
}
