import {Endpoints} from "../../Ednpoints";
import type {FriendRequestAction} from "../../types";

export async function fetchFriendRequest(senderId: string, receiverId: string, action: FriendRequestAction) {
    const res = await fetch(Endpoints.friendRequest(action), {
        method: 'POST',
        body: JSON.stringify({senderId, receiverId}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.json()
}