import {Endpoints} from "../../Endpoints";
import type {Message} from "../../types";

export async function fetchReactToMessage(messageId: Message['_id'], reaction: {emoji: string, by: string}){
    await fetch(Endpoints.reactions(messageId), {
        headers: {
            'Content-Type':'application/json'
        },
        method: 'POST',
        body: JSON.stringify({reaction})
    })
}