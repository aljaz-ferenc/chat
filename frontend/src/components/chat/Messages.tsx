import { useQueryClient } from "@tanstack/react-query";
import {
	type Dispatch,
	type SetStateAction,
	use,
	useEffect,
	useRef,
	useState,
} from "react";
import { useOutletContext, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Chat, Message as TMessage } from "../../../../shared/types";
import type { User } from "../../../../shared/types.ts";
import useChat from "../../hooks/api/useChat.ts";
import useMessages from "../../hooks/api/useMessages.ts";
import { SocketContext } from "../../providers/SocketProvider.tsx";
import useUserStore from "../../state/useUserStore.ts";
import Spinner from "../ui/Spinner.tsx";
import Message from "./Message.tsx";

export default function Messages() {
	const socket = use(SocketContext);
	const { chatId } = useParams();
	const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useMessages(chatId);
	const thisUserId = useUserStore(useShallow((state) => state.user?._id));
	const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
	const { data: chat } = useChat();
	const queryClient = useQueryClient();
	const [initialScrollDone, setInitialScrollDone] = useState(false);
	const beforeHeight = useRef<number>(0);

	const { replyingTo, setReplyingTo } = useOutletContext<{
		replyingTo: TMessage;
		setReplyingTo: Dispatch<SetStateAction<TMessage | null>>;
	}>();
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!socket || !data) return;
		socket.emit("join-chat", { chatId, userId: thisUserId });
		socket.emit(
			"read-message",
			{ chatId, userId: thisUserId },
			(response: { status: string }) => {
				if (response.status === "ok") {
					queryClient.invalidateQueries({ queryKey: ["chats"] });
				}
			},
		);
	}, [data, chatId, socket, thisUserId, queryClient]);

	const messages = data?.pages
		.slice()
		.reverse()
		.flatMap((page) => page.messages);

	useEffect(() => {
		if (!data) return;
		const el = messagesContainerRef.current;
		if (!el || beforeHeight.current === 0) return;

		const newHeight = el.scrollHeight;
		el.scrollTop = newHeight - beforeHeight.current;

		beforeHeight.current = 0;
	}, [data]);

	useEffect(() => {
		const container = messagesContainerRef.current;
		if (!container || !hasNextPage) return;

		const handleScroll = async () => {
			const el = messagesContainerRef.current;
			if (!el) return;

			if (
				el.scrollTop === 0 &&
				!isFetchingNextPage &&
				data?.pages[data.pages.length - 1].hasNext
			) {
				beforeHeight.current = el.scrollHeight;
				await fetchNextPage();
			}
		};

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);

	useEffect(() => {
		if (!messagesContainerRef.current || !messages?.length || initialScrollDone)
			return;

		const el = messagesContainerRef.current;
		el.scrollTop = el.scrollHeight;
		setInitialScrollDone(true);
	}, [messages, initialScrollDone]);

	useEffect(() => {
		if (!socket || !chat) return;

		const handleTyping = ({
			userId,
			isTyping,
			typingChatId,
		}: { userId: string; isTyping: boolean; typingChatId: Chat["_id"] }) => {
			if (chatId !== typingChatId) return;
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

		socket.on("typing", handleTyping);

		socket.on("edit-message", handleEditedMessage);

		return () => {
			socket.off("typing", handleTyping);
			socket.off("edit-message", handleEditedMessage);
		};
	}, [socket, chatId, queryClient, chat]);

	if (!chat || !data)
		return (
			<div className="w-full h-[calc(100vh-160px)] flex flex-col justify-center">
				<Spinner />
			</div>
		);
	if (!thisUserId) return <div>User not found...</div>;

	return (
		<div className="flex">
			<div
				ref={messagesContainerRef}
				className="h-[calc(100vh-160px)] flex flex-col gap-8 items-start bg-background w-full p-6 overflow-y-auto"
			>
				{isFetchingNextPage && (
					<div className="h-5 mx-auto w-full">
						<Spinner />
					</div>
				)}
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
			{/*{chatId && <SharedFiles chatId={chatId} />}*/}
		</div>
	);
}
