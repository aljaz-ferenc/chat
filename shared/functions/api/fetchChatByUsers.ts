import {Endpoints} from "../../Endpoints";
import type {User} from "../../types";

export async function fetchChatByUsers(userId1: User['_id'], userId2: User['_id']){
    const res = await fetch(Endpoints.chatByUsers(userId1, userId2))
    return await res.json()
}