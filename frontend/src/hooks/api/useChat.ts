import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { fetchChatById } from "../../../../shared/functions/api/fetchChatById.ts";
import type { Chat, User } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useChat() {
	const { chatId } = useParams();
	const userId = useUserStore(useShallow((state) => state.user?._id));

	return useQuery({
		queryKey: ["chat", { chatId }],
		queryFn: async () =>
			await fetchChatById(chatId as Chat["_id"], userId as User["_id"]),
		enabled: !!chatId,
	});
}
