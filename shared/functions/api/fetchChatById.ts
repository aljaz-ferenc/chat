import {Endpoints} from "../../Endpoints";
import type {Chat} from "../../types";

export async function fetchChatById(chatId: Chat['_id']){
    const res = await fetch(Endpoints.chat(chatId))
    return await res.json()
}