import { useQuery } from "@tanstack/react-query";
import { fetchSearchUsers } from "../../../../shared/functions/api/fetchSearchUsers.ts";

export default function useSearchUsers(query: string) {
	return useQuery({
		queryKey: ["search", { query }],
		queryFn: async () => await fetchSearchUsers(query),
	});
}
