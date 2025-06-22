import {Endpoints} from "../../Endpoints";
import type {Contact, User} from "../../types";

export async function fetchContact(userId: User['_id'], contactId: User['_id']): Promise<Contact> {
    const res = await fetch(Endpoints.contact(userId, contactId));

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData?.message || "Failed to fetch contact");
        (error as any).status = res.status;
        throw error;
    }

    return await res.json();
}
