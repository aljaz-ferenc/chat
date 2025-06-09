import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchAddUsersToChat } from "../../../../shared/functions/api/fetchAddUsersToChat.ts";
import type { Chat, User } from "../../../../shared/types.ts";

export default function useAddUsersToChat() {
	const { chatId } = useParams();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["chat-addUsers"],
		mutationFn: async (usersIds: User["_id"][]) =>
			await fetchAddUsersToChat(chatId as Chat["_id"], usersIds),
		onSuccess: async () =>{
			queryClient.invalidateQueries({ queryKey: ["chats"] })
			queryClient.invalidateQueries({queryKey: ["chat", { chatId }]})
		}
	});
}
