import {Endpoints} from "../../Ednpoints";
import type {User} from "../../types";

export async function fetchSearchUsers(query: string): Promise<Pick<User, '_id' | 'firstName' | 'lastName' | 'username'>[]>{
    const res = await fetch(Endpoints.searchUsers(query))
    const data = await res.json()
    console.log(data)
    return data || []
}