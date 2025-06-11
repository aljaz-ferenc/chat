import { useQueryClient } from "@tanstack/react-query";
import {
	type Dispatch,
	type SetStateAction,
	use,
	useEffect,
	useState,
} from "react";
import { useOutletContext, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Message as TMessage } from "../../../../shared/types";
import type { User } from "../../../../shared/types.ts";
import useChat from "../../hooks/api/useChat.ts";
import useMessages from "../../hooks/api/useMessages.ts";
import { SocketContext } from "../../providers/SocketProvider.tsx";
import useUserStore from "../../state/useUserStore.ts";
import Message from "./Message.tsx";

export default function Messages() {
	const socket = use(SocketContext);
	const { chatId } = useParams();
	const { data: messages } = useMessages(chatId);
	const thisUserId = useUserStore(useShallow((state) => state.user?._id));
	const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
	const { data: chat } = useChat();
	const queryClient = useQueryClient();
	const { replyingTo, setReplyingTo } = useOutletContext<{
		replyingTo: TMessage;
		setReplyingTo: Dispatch<SetStateAction<TMessage | null>>;
	}>();

	useEffect(() => {
		if (chatId && !!socket) {
			console.log(`joining chat: ${chatId}`);
			socket.emit("join-chat", chatId);

			socket.on("new-message", (message: TMessage) => {
				console.log("received: new-message in Provider");
				// queryClient.setQueryData(
				// 	["messages", { chatId: message.chat }],
				// 	(oldMessages: TMessage[]) => [...oldMessages, message],
				// );
				// queryClient.setQueryData(["chats"], (chats: Chat[]) =>
				// 	chats.map((chat) => {
				// 		if (chat._id === message.chat) {
				// 			return { ...chat, lastMessage: message };
				// 		}
				// 		return chat;
				// 	}),
				// );
			});
			console.log("LISTENERS: ", socket.listeners("new-message"));
		}
	}, [chatId, socket]);

	useEffect(() => {
		if (!socket || !chat) return;

		const handleTyping = ({
			userId,
			isTyping,
		}: { userId: string; isTyping: boolean }) => {
			setTypingUsers((prev) => {
				const newSet = new Set(prev);

				if (isTyping) {
					newSet.add(userId);
				} else {
					newSet.delete(userId);
				}
				return newSet;
			});
		};

		const handleEditedMessage = (message: {
			messageId: string;
			markdown: string;
		}) => {
			queryClient.setQueryData(
				["messages", { chatId }],
				(oldMessages: TMessage[]) => {
					return oldMessages.map((m) => {
						if (m._id === message.messageId) {
							return {
								...m,
								content: {
									...m.content,
									markdown: message.markdown,
								},
								edited: true,
							};
						}
						return m;
					});
				},
			);
		};
		socket.on("new-message", () => {
			console.log("new-message  in Messages.tsx");
		});

		socket.on("typing", handleTyping);

		socket.on("edit-message", handleEditedMessage);

		return () => {
			socket.off("typing", handleTyping);
			socket.off("edit-message", handleEditedMessage);
		};
	}, [socket, chatId, queryClient, chat]);

	if (!chat) return <div>Loading chat</div>;
	if (!messages) return <div>Loading messages...</div>;
	if (!thisUserId) return <div>User not found...</div>;

	return (
		<div className="h-full flex flex-col gap-8 items-start bg-background w-full p-6">
			{messages?.map((message) => (
				<Message
					key={message._id}
					message={message}
					setReplyingTo={setReplyingTo}
					replyingTo={replyingTo}
				/>
			))}
			<div className="mt-auto">
				{Array.from(typingUsers).map((userId) => {
					if (userId === thisUserId) return null;

					return (
						<p className="text-muted text-sm" key={userId}>
							{chat.users.find(
								(u: Pick<User, "firstName" | "_id">) => u._id === userId,
							)?.firstName || "Someone"}{" "}
							is typing...
						</p>
					);
				})}
			</div>
		</div>
	);
}
