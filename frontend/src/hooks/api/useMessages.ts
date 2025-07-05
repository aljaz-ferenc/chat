import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMessages } from "../../../../shared/functions/api/fetchMessages.ts";
import type { Chat } from "../../../../shared/types.ts";

export default function useMessages(chatId?: Chat["_id"]) {
	return useInfiniteQuery({
		queryKey: ["messages", chatId],
		queryFn: async ({ pageParam = 1 }) => {
			return await fetchMessages(chatId as string, pageParam);
		},
		enabled: !!chatId,
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			return lastPage.hasNext ? lastPage.nextCursor : undefined;
		},
	});
}
