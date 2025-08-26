import MessageDropdownMenu from "@/components/chat/Message/MessageDropdownMenu.tsx";
import MessageReactionsPopup from "@/components/chat/Message/MessageReactionsPopup.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { cn } from "@/utils/utils.ts";
import { FacebookCounter } from "@charkour/react-reactions";
import { X } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Message as TMessage } from "../../../../../shared/types.ts";
import { ReplyIcon } from "../../../assets/icons/icons.tsx";
import useEditMessage from "../../../hooks/api/useEditMessage.ts";
import useUserStore from "../../../state/useUserStore.ts";
import UserTag from "../UserTag.tsx";
import MessageFiles from "./MessageFiles.tsx";
import MessageGifs from "./MessageGifs.tsx";
import MessageMarkdown from "./MessageMarkdown.tsx";

type MessageProps = {
	message: TMessage;
	setReplyingTo: Dispatch<SetStateAction<TMessage | null>>;
	replyingTo: TMessage;
};

export default function Message({
	message,
	setReplyingTo,
	replyingTo,
}: MessageProps) {
	const { mutateAsync: editMessage } = useEditMessage();
	const thisUserId = useUserStore(useShallow((state) => state.user?._id));
	const isMine = message.user._id === thisUserId;
	const [isEditing, setIsEditing] = useState(false);
	const [editedMarkdown, setEditedMarkdown] = useState(
		message.content?.markdown || "",
	);
	const { chatId } = useParams();
	const editInputRef = useRef<HTMLTextAreaElement>(null);

	const navigate = useNavigate();

	const handleKeyPress = useCallback(
		async (e: KeyboardEvent) => {
			if (
				document.activeElement === editInputRef.current &&
				(e.code === "Enter" || e.code === "NumpadEnter")
			) {
				if (!chatId) return;

				await editMessage({
					messageId: message._id,
					markdown: editedMarkdown,
					chatId,
				}).then(() => {
					setEditedMarkdown(message.content?.markdown);
					setIsEditing(false);
				});
			}
		},
		[editMessage, editedMarkdown, message, chatId],
	);

	useEffect(() => {
		addEventListener("keypress", handleKeyPress);

		return () => removeEventListener("keypress", handleKeyPress);
	}, [handleKeyPress]);

	if (message.type === "renameChat") {
		return (
			<p className="text-muted-foreground text-center w-full">
				<strong>{message.user.firstName} </strong>
				renamed the group to
				<strong> {message.newChatName}</strong>
			</p>
		);
	}

	if (message.type === "leaveChat") {
		return (
			<p className="text-muted-foreground text-center w-full">
				<strong>{message.user.firstName} </strong>
				left the chat.
			</p>
		);
	}

	// @ts-ignore
	return (
		<div
			key={message._id}
			className={cn([
				"w-full",
				message.replyTo &&
					"ml-2 relative after:content-[''] after:absolute after:w-px after:h-full after:-left-2 after:top-0 after:bg-muted-foreground",
			])}
		>
			<div className={cn(["group w-full"])}>
				<button
					type="button"
					onClick={() => navigate(`/contacts/${message.user._id}`)}
					className="flex gap-2 items-center cursor-pointer"
				>
					<div className="rounded-full overflow-hidden h-[32px] aspect-square">
						<img
							src={message.user.imageUrl}
							className="h-full w-full object-cover"
							alt=""
						/>
					</div>
					<span className="text-primary font-bold">
						{message.user.firstName} {message.user.lastName}
					</span>
				</button>
				{message.replyTo?.user?.firstName && (
					<>
						<div className="text-muted-foreground mt-2 flex items-center gap-2 mb-2">
							<div className="h-4 [&_svg]:h-full">
								<ReplyIcon />
							</div>
							<UserTag user={message.replyTo.user} className="text-sm" />
							{message.replyTo?.content?.markdown && (
								<span className="text-muted-foreground text-sm">
									{message.replyTo?.content?.markdown}
								</span>
							)}
						</div>
						{message.replyTo.content.files.length > 0 && (
							<div className="mb-6">
								<MessageFiles files={message.replyTo.content.files} />
							</div>
						)}
					</>
				)}

				<div className="flex gap-2 items-center">
					<div className={cn([isEditing && "w-full rounded mt-2"])}>
						{!isEditing ? (
							<MessageMarkdown message={message} isMine={isMine} />
						) : (
							<div className="p-2 rounded">
								<div className="flex items-center gap-2 mb-2">
									<button
										type="button"
										className="cursor-pointer"
										onClick={() => setIsEditing(false)}
									>
										<X size={15} />
									</button>
									<span className="text-muted-foreground">Edit:</span>
								</div>
								<Textarea
									ref={editInputRef}
									value={editedMarkdown}
									onChange={(e) => setEditedMarkdown(e.target.value)}
									className="text-primary p-2 field-sizing-content  resize-none border-input placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-19.5 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
								/>
							</div>
						)}
						{!isEditing && (
							<div className="flex flex-col gap-2">
								<MessageFiles files={message.content.files} />
								<MessageGifs gifs={message.content.gifs} />
							</div>
						)}
					</div>
					{thisUserId && (
						<MessageReactionsPopup
							isEditing={isEditing}
							messageId={message._id}
							userId={thisUserId}
						/>
					)}
					<MessageDropdownMenu
						isMine={isMine}
						isEditing={isEditing}
						setIsEditing={setIsEditing}
						message={message}
						replyingTo={replyingTo}
						setReplyingTo={setReplyingTo}
						setEditedMarkdown={setEditedMarkdown}
					/>
				</div>
			</div>
			<FacebookCounter
				bg={"var(--background)"}
				user={thisUserId}
				counters={message.reactions}
			/>
		</div>
	);
}
