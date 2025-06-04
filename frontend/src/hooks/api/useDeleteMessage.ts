import { useMutation } from "@tanstack/react-query";
import { fetchDeleteMessage } from "../../../../shared/functions/api/fetchDeleteMessage.ts";
import type { Message } from "../../../../shared/types.ts";

export default function useDeleteMessage() {
	return useMutation({
		mutationKey: ["message", { action: "delete" }],
		mutationFn: async ({
			messageId,
			chatId,
		}: {
			messageId: Message["_id"];
			chatId: Message["chat"];
		}) => await fetchDeleteMessage(messageId, chatId),
	});
}
