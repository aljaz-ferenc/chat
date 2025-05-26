export type User = {
    _id: string,
    clerkId: string,
    firstName: string,
    lastName: string,
    email: string,
    friends: {
        incomingRequests: User[],
        pendingRequests: User[],
        blocked: User[],
        friends: User[]
    },
    notifications: {
        notifications: Notification[],
        opened: boolean }
}

export type FriendRequestAction = 'send' | 'accept' | 'cancel' | 'decline'
export type NotificationAction = 'read'

export type Notification = {
    read: boolean,
    type: 'friendRequest',
    from: User,
}