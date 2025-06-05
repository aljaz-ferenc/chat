import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchChatById } from "../../../../shared/functions/api/fetchChatById.ts";
import type { Chat } from "../../../../shared/types.ts";

export default function useChat() {
	const { chatId } = useParams();

	return useQuery({
		queryKey: ["chat", { chatId }],
		queryFn: async () => await fetchChatById(chatId as Chat["_id"]),
		enabled: !!chatId,
	});
}
