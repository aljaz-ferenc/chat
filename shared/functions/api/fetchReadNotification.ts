import {Endpoints} from "../../Endpoints";
import type {User} from "../../types";

export default async function fetchReadNotification(userId: User['_id']){
    const res = await fetch(Endpoints.notifications('read'), {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({userId})
    })
    return await res.json()
}