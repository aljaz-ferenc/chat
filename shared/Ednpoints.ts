import type {FriendRequestAction, NotificationAction, User} from "./types";

const BASE_URL = '/api/v1'

export class Endpoints {
    public static users = (userId?: User['_id']) => `${BASE_URL}/users${userId ? `/${userId}` : ''}`
    public static friendRequest = (action: FriendRequestAction) => `${BASE_URL}/friendRequest/${action}`
    public static notifications = (action: NotificationAction) => `${BASE_URL}/notifications/${action}`
    public static contact = (userId: User['_id'], contactId: User['_id']) => `${BASE_URL}/contacts/${userId}/${contactId}`
    public static contacts = (userId: User['_id']) => `${BASE_URL}/contacts/${userId}`
    public static searchUsers = (query: string) => `${BASE_URL}/users/search/${query}`
}