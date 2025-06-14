import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { fetchRenameChat } from "../../../../shared/functions/api/fetchRenameChat.ts";
import type { Chat } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useRenameChat() {
	const { chatId } = useParams();
	const userId = useUserStore(useShallow((state) => state.user?._id));
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["chat-rename"],
		mutationFn: async (chatName: Chat["name"]) =>
			fetchRenameChat(chatId as string, chatName, userId as string),
		onSuccess: async () =>
			await queryClient.invalidateQueries({ queryKey: ["chats"] }),
	});
}
