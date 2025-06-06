import type {Chat, FriendRequestAction, Message, NotificationAction, User} from "./types";

const BASE_URL = '/api/v1'

export class Endpoints {
    public static users = (userId?: User['_id']) => `${BASE_URL}/users${userId ? `/${userId}` : ''}`
    public static friendRequest = (action: FriendRequestAction) => `${BASE_URL}/friendRequest/${action}`
    public static notifications = (action: NotificationAction) => `${BASE_URL}/notifications/${action}`
    public static contact = (userId: User['_id'], contactId: User['_id']) => `${BASE_URL}/contacts/${userId}/${contactId}`
    public static contacts = (userId: User['_id']) => `${BASE_URL}/contacts/${userId}`
    public static searchUsers = (query: string) => `${BASE_URL}/users/search/${query}`
    public static chat = (chatId: string) => `${BASE_URL}/chats/${chatId}`
    public static chats = (userId: User['_id']) => `${BASE_URL}/chats/user/${userId}`
    public static messages = (chatId?: Chat['_id']) =>
        `${BASE_URL}/messages` + (chatId ? `/${chatId}` : '');
    public static message = (messageId: Message['_id']) => `${BASE_URL}/messages/${messageId}`
}