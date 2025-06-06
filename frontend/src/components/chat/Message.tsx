import { FacebookCounter, FacebookSelector } from "@charkour/react-reactions";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import { EditIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Message as TMessage } from "../../../../shared/types.ts";
import { TrashIcon } from "../../assets/icons/icons.tsx";
import useDeleteMessage from "../../hooks/api/useDeleteMessage.ts";
import useEditMessage from "../../hooks/api/useEditMessage.ts";
import useReactToMessage from "../../hooks/api/useReactToMessage.ts";
import useUserStore from "../../state/useUserStore.ts";
import { cn } from "../../utils/utils.ts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/DropdownMenu.tsx";
import IconButton from "../ui/IconButton.tsx";

type MessageProps = {
	message: TMessage;
};

export default function Message({ message }: MessageProps) {
	const { mutateAsync: editMessage } = useEditMessage();
	const thisUserId = useUserStore(useShallow((state) => state.user?._id));
	const isMine = message.user === thisUserId;
	const { mutateAsync: deleteMessage } = useDeleteMessage();
	const [isEditing, setIsEditing] = useState(false);
	const [editedMarkdown, setEditedMarkdown] = useState(
		message.content.markdown,
	);
	const { chatId } = useParams();
	const editInputRef = useRef<HTMLTextAreaElement>(null);
	const [reactionsAreOpen, setReactionsAreOpen] = useState(false);
	const { mutateAsync: react } = useReactToMessage();

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
					setEditedMarkdown(message.content.markdown);
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

	return (
		<div key={message._id}>
			<div
				className={cn([
					"group w-full",
					isMine ? "" : "grid grid-cols-[32px_auto_auto] gap-2",
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
				<div className="flex gap-2 justify-end">
					<div>
						{!isEditing ? (
							<MessageMarkdown message={message} isMine={isMine} />
						) : (
							<textarea
								ref={editInputRef}
								value={editedMarkdown}
								onChange={(e) => setEditedMarkdown(e.target.value)}
								className="w-full h-10 text-white border-white border outline-none p-1"
							/>
						)}
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
								<DropdownMenuItem
									onClick={() => {
										setIsEditing(true);
										setEditedMarkdown(message.content.markdown);
									}}
									className="flex items-center gap-2 hover:text-white cursor-pointer transition"
								>
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
					<div className="h-full flex items-center z-20">
						<div className="flex gap-2">
							<Popover
								open={reactionsAreOpen}
								onOpenChange={setReactionsAreOpen}
							>
								<PopoverTrigger>
									<IconButton icon="emoji" className="max-h-6 p-1.5" />
								</PopoverTrigger>
								<PopoverContent>
									<FacebookSelector
										onSelect={async (reaction) =>
											await react({
												messageId: message._id,
												reaction: { emoji: reaction, by: thisUserId as string },
											}).then(() => setReactionsAreOpen(false))
										}
										iconSize={30}
									/>
								</PopoverContent>
							</Popover>
							<div>Reply</div>
						</div>
					</div>
				)}
			</div>
			<FacebookCounter
				bg={"var(--color-primary)"}
				user={thisUserId}
				counters={message.reactions}
			/>
		</div>
	);
}

type MessageMarkdownProps = {
	message: TMessage;
	isMine: boolean;
};

function MessageMarkdown({ message, isMine }: MessageMarkdownProps) {
	return (
		<div
			className={cn([
				"text-white rounded-xl p-2",
				isMine ? "bg-message-primary" : "bg-message-secondary",
			])}
		>
			<p>
				{message.content.markdown}{" "}
				{message.edited && (
					<span className="text-muted text-xs italic">Edited</span>
				)}
			</p>
		</div>
	);
}

type MessageFilesProps = {
	messageId: TMessage["_id"];
};

//TODO: temporarily hidden
function MessageFiles({ messageId }: MessageFilesProps) {
	return <div className="hidden">{messageId} files</div>;
}
