import {useQuery} from "@tanstack/react-query";
import {fetchAllUsers} from "../../../../shared/functions/api/fetchAllUsers.ts";

export default function useAllUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => await fetchAllUsers()
    })
}