import {Endpoints} from "../../Ednpoints";
import type {User} from "../../types";

export async function fetchAllUsers(): Promise<User[]> {
    const res = await fetch(Endpoints.users())
    return res.json()
}