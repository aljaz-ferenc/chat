import {Endpoints} from "../../Endpoints";
import type {Chat, Message} from "../../types";

export async function fetchMessages(chatId: Chat['_id']): Promise<Message[]>{
    const res = await fetch(Endpoints.messages(chatId))
    const data = await res.json()
    console.log('DATA: ', data)
    return data
}