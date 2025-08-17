import {Endpoints} from "../../Endpoints";
import type {User} from "../../types";

export async function fetchDeleteNotifications(userId: User['_id']){
    await fetch(Endpoints.notifications(''), {
        method: 'DELETE',
        body: JSON.stringify({userId}),
        headers: {
            'Content-Type':"application/json"
        }
    })
}