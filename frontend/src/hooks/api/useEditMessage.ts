import { useMutation } from "@tanstack/react-query";
import { fetchEditMessage } from "../../../../shared/functions/api/fetchEditMessage.ts";
import type { Chat, Message } from "../../../../shared/types.ts";

export default function useEditMessage() {
	return useMutation({
		mutationKey: ["message-edit"],
		mutationFn: async ({
			messageId,
			markdown,
			chatId,
		}: {
			messageId: Message["_id"];
			markdown: Message["content"]["markdown"];
			chatId: Chat["_id"];
		}) => fetchEditMessage(messageId, markdown, chatId),
	});
}
