import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { fetchContact } from "../../../../shared/functions/api/fetchContact.ts";
import type { User } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";

export default function useContact(contactId: User["_id"]) {
	const userId = useUserStore(useShallow((state) => state.user?._id));

	return useQuery({
		queryKey: ["contacts", { contactId }],
		queryFn: () => fetchContact(userId as User["_id"], contactId),
		enabled: !!userId,
	});
}
