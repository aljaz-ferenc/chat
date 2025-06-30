import {Endpoints} from "../../Endpoints";
import type {Chat, User} from "../../types";

export async function fetchChatById(chatId: Chat['_id'], userId: User['_id']){
    const res = await fetch(Endpoints.chat(chatId), {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({userId})
    })
    return await res.json()
}