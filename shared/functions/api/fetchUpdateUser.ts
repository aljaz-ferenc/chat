import {Endpoints} from "../../Endpoints";
import type {User} from "../../types";

export async function fetchUpdateUser(clerkId: User['clerkId'], updates: Partial<User>){

    const res = await fetch(Endpoints.users(clerkId), {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({updates})
    })

    return await res.json()
}