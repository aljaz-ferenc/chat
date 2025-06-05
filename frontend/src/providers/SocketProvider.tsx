import { useQueryClient } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useEffect } from "react";
import { type Socket, io } from "socket.io-client";
import { useShallow } from "zustand/react/shallow";
import type { Chat, Message } from "../../../shared/types.ts";
import useUser from "../hooks/api/useUser.ts";
import useUserStore from "../state/useUserStore.ts";
// @ts-ignore
const socket = io(import.meta.env.VITE_BACKEND_URL, { autoConnect: false });

export const SocketContext = createContext<Socket | null>(null);

export default function SocketProvider({ children }: PropsWithChildren) {
	const userId = useUserStore(useShallow((state) => state.user?._id));
	const { refetch } = useUser();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!userId) return;
		socket.connect();

		socket.on("connect", () => {
			socket.emit("online", userId);
		});

		socket.on("new-message", (message: Message) => {
			queryClient.setQueryData(
				["messages", { chatId: message.chat }],
				(oldMessages: Message[]) => [...oldMessages, message],
			);
			queryClient.setQueryData(["chats"], (chats: Chat[]) =>
				chats.map((chat) => {
					if (chat._id === message.chat) {
						return { ...chat, lastMessage: message };
					}
					return chat;
				}),
			);
		});

		socket.on(
			"delete-message",
			({
				messageId,
				chatId,
			}: {
				messageId: Message["_id"];
				chatId: Message["chat"];
			}) => {
				const updatedMessages = queryClient.setQueryData(
					["messages", { chatId }],
					(oldMessages: Message[] = []) =>
						oldMessages.filter((m) => m._id !== messageId),
				) as Message[];

				//@ts-ignore
				const lastMessage = updatedMessages.at(-1) ?? null;
				console.log("LAST_MESSAGE: ", lastMessage);

				console.log("LAST_MESSAGE: ", lastMessage);
				queryClient.setQueryData(["chats"], (chats: Chat[] = []) =>
					chats.map((chat) => {
						if (chat._id === chatId) {
							return { ...chat, lastMessage };
						}
						return chat;
					}),
				);
			},
		);

		//TODO: use same event for each if they do the same thing, but wait for confirmation
		socket.on("friendRequest-incoming", async () => {
			await refetch();
		});

		socket.on("notification-new", async () => {
			await refetch();
		});

		socket.on("friendRequest-declined", async () => {
			await refetch();
		});

		socket.on("friendRequest-accepted", async () => {
			await refetch();
		});

		socket.on("friendRequest-canceled", async () => {
			await refetch();
		});

		socket.on("friendRequest-unfriended", async () => {
			await refetch();
		});

		return () => {
			socket.off("connect");
			socket.disconnect();
		};
	}, [userId, refetch, queryClient]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
}
