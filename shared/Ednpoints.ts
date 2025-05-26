import type {FriendRequestAction} from "./types";

const BASE_URL = '/api/v1'

export class Endpoints {
    public static users = (userId?: string) => `${BASE_URL}/users${userId ? `/${userId}` : ''}`
    public static friendRequest = (action: FriendRequestAction) => `${BASE_URL}/friendRequest/${action}`
}