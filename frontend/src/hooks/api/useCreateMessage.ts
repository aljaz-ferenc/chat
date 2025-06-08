import { useMutation } from "@tanstack/react-query";
import { fetchCreateMessage } from "../../../../shared/functions/api/fetchCreateMessage.ts";
import type { Chat, Message, User } from "../../../../shared/types.ts";

export default function useCreateMessage() {
	return useMutation({
		mutationKey: ["message", { action: "create" }],
		mutationFn: async (message: {
			user: User["_id"];
			chat: Chat["_id"];
			content: Message["content"];
			replyTo: Message["_id"] | null;
		}) => await fetchCreateMessage(message),
	});
}
