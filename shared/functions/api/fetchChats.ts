import {Endpoints} from "../../Endpoints";
import {Chat, User} from "../../types";

export async function fetchChats(userId: User['_id']): Promise<Chat[]>{
    const res = await fetch(Endpoints.chats(userId))
    return await res.json()
}