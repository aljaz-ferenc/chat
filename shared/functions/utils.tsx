import type {User} from "../types";

const dateFormatterOptions = {month: 'long', day: 'numeric'}

export function formatDate(date: Date){
    // @ts-ignore
    return date.toLocaleDateString('en-US', dateFormatterOptions)
}

export const isFriend = (userId: string, thisUser: User) => {
    return thisUser?.friends.friends.some((u) => u._id === userId);
};

export const isPendingRequest = (userId: string, thisUser: User) => {
    return thisUser?.friends.pendingRequests.some((u) => u._id === userId);
};

export const isBlocked = (userId: string, thisUser: User) => {
    return thisUser?.friends.blocked.some((u) => u._id === userId);
};

export const isIncomingRequest = (userId: string, thisUser: User) => {
    return thisUser?.friends.incomingRequests.some((u) => u._id === userId);
};