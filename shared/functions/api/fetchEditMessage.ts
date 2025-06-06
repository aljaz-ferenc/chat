import {Endpoints} from "../../Endpoints";
import type {Chat, Message} from "../../types";

export async function fetchEditMessage(messageId: Message['_id'], markdown: Message['content']['markdown'], chatId: Chat['_id']){
    await fetch(Endpoints.message(messageId), {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({messageId, markdown, chatId})
    })
}