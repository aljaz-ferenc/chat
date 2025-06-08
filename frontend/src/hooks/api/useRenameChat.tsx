import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchRenameChat } from "../../../../shared/functions/api/fetchRenameChat.ts";
import type { Chat } from "../../../../shared/types.ts";

export default function useRenameChat() {
	const { chatId } = useParams();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["chat-rename"],
		mutationFn: async (chatName: Chat["name"]) =>
			fetchRenameChat(chatId, chatName),
		onSuccess: async () => await queryClient.invalidateQueries(["chats"]),
	});
}
