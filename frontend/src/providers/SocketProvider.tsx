import { useQueryClient } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useEffect } from "react";
import { type Socket, io } from "socket.io-client";
import { useShallow } from "zustand/react/shallow";
import type { Chat, Message } from "../../../shared/types.ts";
import useUser from "../hooks/api/useUser.ts";
import useUserStore from "../state/useUserStore.ts";
// @ts-ignore
const socket = io("https://chat-xbp0.onrender.com");

export const SocketContext = createContext<Socket | null>(null);

export default function SocketProvider({ children }: PropsWithChildren) {
	const userId = useUserStore(useShallow((state) => state.user?._id));
	const { refetch } = useUser();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!userId || !socket.connected) return;
		socket?.emit("online", userId);
	}, [userId]);

	useEffect(() => {
		if (!userId || !socket.connected) return;

		socket.on("connect_error", (err) => {
			console.log("Socket connection error: ", err.message);
		});
		socket.emit("online", userId);
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

		socket.on("chat-rename", (renameMessage) => {
			queryClient.setQueryData(["chats"], (chats: Chat[]) => {
				return chats.map((chat) => {
					if (chat._id === renameMessage.chat.toString()) {
						return { ...chat, name: renameMessage.newChatName };
					}
					return chat;
				});
			});

			queryClient.setQueryData(
				["messages", { chatId: renameMessage.chat.toString() }],
				(oldMessages: Message[]) => {
					return [...oldMessages, renameMessage];
				},
			);
		});

		socket.on("user-left", async (data) => {
			const { chatId, userId } = data;

			queryClient.setQueryData(["chats"], (chats: Chat[]) => {
				return chats.map((chat) => {
					if (chat._id === chatId) {
						return {
							...chat,
							users: chat.users.filter((u) => u._id !== userId),
						};
					}
					return chat;
				});
			});
			await queryClient.invalidateQueries({
				queryKey: ["messages", { chatId }],
			});
		});

		socket.on("added-to-group", async (chatId: Chat["_id"]) => {
			await queryClient.invalidateQueries({ queryKey: ["chats"] });
			await queryClient.invalidateQueries({ queryKey: ["chat", { chatId }] });
			await refetch();
		});

		socket.on("reaction", ({ reaction, chatId, messageId }) => {
			queryClient.setQueryData(
				["messages", { chatId }],
				(oldMessages: Message[]) => {
					return oldMessages.map((m) => {
						if (m._id === messageId) {
							const updatedReactions = [...m.reactions, reaction];

							return {
								...m,
								reactions: updatedReactions,
							};
						}
						return m;
					});
				},
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
