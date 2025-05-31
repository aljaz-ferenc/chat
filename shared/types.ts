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
        opened: boolean }
}

export type Contact = User & {mutualFriends: string[]}

export type FriendRequestAction = 'send' | 'accept' | 'cancel' | 'decline' | 'unfriend'
export type NotificationAction = 'read'

export type Notification = {
    read: boolean,
    type: 'friendRequest',
    from: User,
}