import {Endpoints} from "../../Endpoints";
import type {Chat, Message, User} from "../../types";

export async function fetchCreateMessage(message: {user: User['_id'], chat: Chat['_id'], content: Message['content'], replyTo: Message['_id'] | null, type: Message['type']}){

    return await fetch(Endpoints.messages(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message})
    })
}