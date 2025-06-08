import {Endpoints} from "../../Endpoints";
import {Chat} from "../../types";

export async function fetchRenameChat(chatId: Chat['_id'], chatName: Chat['name']){
    const res = await fetch(Endpoints.chat(chatId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({chatName})
    })
}