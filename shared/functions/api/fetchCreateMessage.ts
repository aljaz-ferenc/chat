import type {Message} from "../../types";
import {Endpoints} from "../../Endpoints";

export async function fetchCreateMessage(message: Pick<Message, 'content' | 'user' | 'chat' | 'replyTo'>){

    return await fetch(Endpoints.messages(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message})
    })
}