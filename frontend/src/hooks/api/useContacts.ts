import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { fetchContacts } from "../../../../shared/functions/api/fetchContacts.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useContacts() {
	const userId = useUserStore(useShallow((state) => state.user?._id));

	return useQuery({
		queryKey: ["contacts"],
		queryFn: () => fetchContacts(userId as string),
		enabled: !!userId,
	});
}
