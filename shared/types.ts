export type User = {
    _id: string,
    clerkId: string,
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    about: string,
    birthday: Date,
    gender: 'male' | 'female',
    languages: string[],
    city: string,
    country: string,
    phoneNumber: string,
    imageUrl: string,
    bgImage: string,
    socials: {
        facebook: string,
        x: string,
        instagram: string,
        tiktok: string,
    }
    friends: {
        incomingRequests: User[],
        pendingRequests: User[],
        blocked: User[],
        friends: User[]
    },
    notifications: {
        notifications: Notification[],
        opened: boolean
    },
    chats: Chat[] | string[]
}

export type Contact = User & {mutualFriends: Pick<User, '_id' | 'firstName' | 'lastName' | 'username' | 'imageUrl'>[]}

export type FriendRequestAction = 'send' | 'accept' | 'cancel' | 'decline' | 'unfriend'
export type NotificationAction = 'read' | ''

export type Notification = {
    _id: string
    read: boolean,
    type: 'friendRequest' | 'addedToGroup',
    from: User,
    chatId: Chat['_id']
}

export type Chat = {
    _id: string,
    type: 'single' | 'group',
    users: User[],
    lastMessage: Message,
    name: string,
    readBy: string[]
}

export type Message = {
    _id: string;
    user: User;
    chat: Chat['_id'];
    content:{
        markdown: string,
        files: string[]
    };
    edited: boolean;
    createdAt: Date;
    updatedAt: Date;
    reactions: {
        emoji: string,
        by: string
    };
    replyTo?: Message | null
    type: 'userMessage' | 'renameChat' | 'leaveChat',
    newChatName?: string
}