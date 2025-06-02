import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../../../../shared/functions/api/fetchMessages.ts";
import type { Chat } from "../../../../shared/types.ts";

export default function useMessages(chatId?: Chat["_id"]) {
	return useQuery({
		queryKey: ["messages", { chatId }],
		queryFn: async () => await fetchMessages(chatId as string),
		enabled: !!chatId,
	});
}
