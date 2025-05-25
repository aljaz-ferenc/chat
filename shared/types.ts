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
    }
}