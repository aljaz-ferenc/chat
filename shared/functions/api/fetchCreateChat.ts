import {Endpoints} from "../../Endpoints";
import type {Chat, User} from "../../types";

export async function fetchCreateChat(userId: User['_id'], chatType: Chat['type']){
    await fetch(Endpoints.chat(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId, chatType})
    })
}