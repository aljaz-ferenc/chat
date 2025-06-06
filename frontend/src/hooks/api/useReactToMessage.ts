import { useMutation } from "@tanstack/react-query";
import { fetchReactToMessage } from "../../../../shared/functions/api/fetchReactToMessage.ts";
import type { Message } from "../../../../shared/types.ts";

export default function useReactToMessage() {
	return useMutation({
		mutationKey: ["reactions"],
		mutationFn: async ({
			messageId,
			reaction,
		}: {
			messageId: Message["_id"];
			reaction: { emoji: string; by: string };
		}) => fetchReactToMessage(messageId, reaction),
	});
}
