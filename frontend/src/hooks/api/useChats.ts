import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { fetchChats } from "../../../../shared/functions/api/fetchChats.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useChats() {
	const userId = useUserStore(useShallow((state) => state.user?._id));

	return useQuery({
		queryKey: ["chats"],
		queryFn: async () => await fetchChats(userId as string),
		enabled: !!userId,
	});
}
