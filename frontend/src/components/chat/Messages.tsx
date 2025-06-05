import { EditIcon } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Message, User } from "../../../../shared/types.ts";
import { TrashIcon } from "../../assets/icons/icons.tsx";
import useChat from "../../hooks/api/useChat.ts";
import useDeleteMessage from "../../hooks/api/useDeleteMessage.ts";
import useMessages from "../../hooks/api/useMessages.ts";
import { SocketContext } from "../../providers/SocketProvider.tsx";
import useUserStore from "../../state/useUserStore.ts";
import { cn } from "../../utils/utils.ts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/DropdownMenu.tsx";
import IconButton from "../ui/IconButton.tsx";

export default function Messages() {
	const socket = use(SocketContext);
	const { chatId } = useParams();
	const { data: messages } = useMessages(chatId);
	const thisUserId = useUserStore(useShallow((state) => state.user?._id));
	const { mutateAsync: deleteMessage } = useDeleteMessage();
	const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
	const { data: chat } = useChat();

	useEffect(() => {
		if (!socket) return;

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

		socket.on("typing", handleTyping);

		return () => {
			socket.off("typing", handleTyping);
		};
	}, [socket]);

	if (!messages) return <div>Loading messages...</div>;
	if (!thisUserId) return <div>User not found...</div>;

	return (
		<div className="h-full flex flex-col gap-5 items-start bg-background w-full p-6">
			{messages?.map((message) => {
				const isMine = message.user === thisUserId;

				return (
					<div
						key={message._id}
						className={cn([
							"group",
							isMine
								? "self-end"
								: " grid grid-cols-[32px_auto_auto] gap-2 place-items-center",
						])}
					>
						{!isMine && (
							<div className="rounded-full overflow-hidden h-[32px] aspect-square">
								<img
									src="https://picsum.photos/32"
									className="h-full w-full object-cover"
									alt=""
								/>
							</div>
						)}
						<div className="flex gap-2">
							<div>
								<MessageMarkdown
									messageId={message._id}
									markdown={message.content.markdown}
									isMine={isMine}
								/>
								<MessageFiles messageId={message._id} />
							</div>
							{isMine && (
								<DropdownMenu>
									<DropdownMenuTrigger className="cursor-pointer [&_svg]:fill-muted">
										<IconButton
											icon="ellipsis"
											className="h-[24px] w-[24px] p-1.5"
										/>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="bg-primary border-border text-muted">
										<DropdownMenuItem className="flex items-center gap-2 hover:text-white cursor-pointer transition">
											<EditIcon />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											asChild
											className="flex w-full items-center gap-2 hover:text-white cursor-pointer transition"
										>
											<button
												type="button"
												onClick={async () =>
													await deleteMessage({
														messageId: message._id,
														chatId: message.chat,
													})
												}
											>
												<TrashIcon />
												Delete
											</button>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
						{!isMine && (
							<div className="h-full flex items-center">
								<div className="flex gap-2 invisible group-hover:visible">
									<div>react</div>
									<div>Reply</div>
								</div>
							</div>
						)}
					</div>
				);
			})}
			<div className="mt-auto">
				{Array.from(typingUsers).map((userId) => {
					if (userId === thisUserId) return null;

					return (
						<p className="text-muted text-sm" key={userId}>
							{
								chat.users.find(
									(u: Pick<User, "firstName" | "_id">) => u._id === userId,
								).firstName
							}{" "}
							is typing...
						</p>
					);
				})}
			</div>
		</div>
	);
}

type MessageMarkdownProps = {
	messageId: Message["_id"];
	markdown: Message["content"]["markdown"];
	isMine: boolean;
};

function MessageMarkdown({
	// messageId,
	markdown,
	isMine,
}: MessageMarkdownProps) {
	return (
		<div
			className={cn([
				"text-white rounded-xl p-2",
				isMine ? "bg-message-primary" : "bg-message-secondary",
			])}
		>
			<p>{markdown}</p>
		</div>
	);
}

type MessageFilesProps = {
	messageId: Message["_id"];
};

//TODO: temporarily hidden
function MessageFiles({ messageId }: MessageFilesProps) {
	return <div className="hidden">{messageId} files</div>;
}
