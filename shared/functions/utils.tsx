import type {User} from "../types";
import {RefObject, useCallback} from "react";

const dateFormatterOptions = {month: 'long', day: 'numeric'}

export function formatDate(date: Date){
    // @ts-ignore
    return date.toLocaleDateString('en-US', dateFormatterOptions)
}

export function highlightText(text: string, query: string) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
        regex.test(part) ? (
            <mark key={index} className="bg-yellow-300">
                {part}
            </mark>
        ) : (
            part
        )
    );
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