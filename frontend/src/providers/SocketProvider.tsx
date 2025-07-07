import { useQueryClient } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useEffect } from "react";
import { type Socket, io } from "socket.io-client";
import { useShallow } from "zustand/react/shallow";
import type { ResponseType } from "../../../shared/functions/api/fetchMessages.ts";
import type { Chat, Message } from "../../../shared/types.ts";
import useUser from "../hooks/api/useUser.ts";
import useUserStore from "../state/useUserStore.ts";

const socket = io(
	process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: import.meta.env.VITE_BACKEND_URL,
);

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
			queryClient.invalidateQueries({ queryKey: ["chats"] });
			queryClient.invalidateQueries({
				queryKey: ["messages", message.chat],
			});
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
				["messages",  renameMessage.chat.toString() ],
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
				queryKey: ["messages",  chatId ],
			});
		});

		socket.on("added-to-group", async (chatId: Chat["_id"]) => {
			await queryClient.invalidateQueries({ queryKey: ["chats"] });
			await queryClient.invalidateQueries({ queryKey: ["chat", { chatId }] });
			await refetch();
		});

		// @ts-ignore
		socket.on("reaction", ({ reaction, chatId, messageId }) => {
			queryClient.invalidateQueries({queryKey: ['messages', chatId]})
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
				queryClient.setQueryData(
					["messages", chatId],
					(
						oldData:
							| {
									pages: ResponseType[];
							  }
							| undefined,
					) => {
						if (!oldData) return oldData;

						const updatedPages = oldData.pages.map((page) => ({
							...page,
							messages: page.messages.filter((m) => m._id !== messageId),
						}));

						const allMessages = updatedPages.flatMap((page) => page.messages);

						// @ts-ignore
						const lastMessage = allMessages.at(-1) || null;

						// Update the chat list with new last message
						queryClient.setQueryData(["chats"], (chats: Chat[] = []) =>
							chats.map((chat) =>
								chat._id === chatId ? { ...chat, lastMessage } : chat,
							),
						);

						return {
							...oldData,
							pages: updatedPages,
						};
					},
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
