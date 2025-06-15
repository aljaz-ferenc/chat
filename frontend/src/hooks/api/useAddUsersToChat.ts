import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { fetchAddUsersToChat } from "../../../../shared/functions/api/fetchAddUsersToChat.ts";
import type { Chat, User } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useAddUsersToChat() {
	const { chatId } = useParams();
	const queryClient = useQueryClient();
	const userId = useUserStore(useShallow((state) => state.user?._id));

	return useMutation({
		mutationKey: ["chat-addUsers"],
		mutationFn: async (usersIds: User["_id"][]) =>
			await fetchAddUsersToChat(
				chatId as Chat["_id"],
				usersIds,
				userId as User["_id"],
			),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["chats"] });
			queryClient.invalidateQueries({ queryKey: ["chat", { chatId }] });
		},
	});
}
