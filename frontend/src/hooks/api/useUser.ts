import {useQuery} from "@tanstack/react-query";
import {fetchUser} from "../../../../shared/functions/api/fetchUser.ts";
import {useAuth} from "@clerk/clerk-react";

export default function useUser() {
    const {userId: clerkId}  = useAuth()

    return useQuery({
        queryKey: ['users', {clerkId}],
        queryFn: async () => await fetchUser(clerkId as string),
        enabled: !!clerkId
    })
}