import {Endpoints} from "../../Endpoints";
import {Contact, User} from "../../types";

export async function fetchContacts(userId: User['_id']): Promise<Contact[]>{
    const res = await fetch(Endpoints.contacts(userId))
    return await res.json()
}