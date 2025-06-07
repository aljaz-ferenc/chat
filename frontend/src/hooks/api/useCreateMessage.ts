import { useMutation } from "@tanstack/react-query";
import { fetchCreateMessage } from "../../../../shared/functions/api/fetchCreateMessage.ts";
import type { Message } from "../../../../shared/types.ts";

export default function useCreateMessage() {
	return useMutation({
		mutationKey: ["message", { action: "create" }],
		mutationFn: async (
			message: Pick<Message, "content" | "user" | "chat" | "replyTo">,
		) => await fetchCreateMessage(message),
	});
}
