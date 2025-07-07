import {Endpoints} from "../../Endpoints";
import type {Chat, Message} from "../../types";

export type ResponseType = {
    messages: Message[];
    hasNext: boolean;
    nextCursor: number;
    currentPage: number;
    totalMessages: number
};

export async function fetchMessages(chatId: Chat['_id'], page: number): Promise<ResponseType>{
    const res = await fetch(Endpoints.messages(chatId, page))
    const data = await res.json()
    return data
}