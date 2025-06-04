import {Endpoints} from "../../Endpoints";
import type {Message} from "../../types";

export async function fetchDeleteMessage(messageId: Message['_id'], chatId: Message['chat']){
    await fetch(Endpoints.messages(), {
        method: 'DELETE',
        body: JSON.stringify({messageId, chatId}),
        headers: {
            'Content-Type':'application/json'
        }
    })
}