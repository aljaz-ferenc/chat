import {Endpoints} from "../../Endpoints";
import type {Contact, User} from "../../types";

export async function fetchContact(userId: User['_id'], contactId: User['_id']): Promise<Contact>{
    const res = await fetch(Endpoints.contact(userId, contactId))
    return await res.json()
}