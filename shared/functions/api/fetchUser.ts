import {Endpoints} from "../../Endpoints";
import type {User} from "../../types";

export async function fetchUser(clerkId: string): Promise<User> {
    const res = await fetch(Endpoints.users(clerkId))
    return res.json()
}