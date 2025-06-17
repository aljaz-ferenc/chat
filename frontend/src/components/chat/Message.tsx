import { FacebookCounter, FacebookSelector } from "@charkour/react-reactions";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import { EditIcon } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	use,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Message as TMessage } from "../../../../shared/types.ts";
import {
	DownloadIcon,
	ReplyIcon,
	TrashIcon,
	TxtFileIcon,
} from "../../assets/icons/icons.tsx";
import useDeleteMessage from "../../hooks/api/useDeleteMessage.ts";
import useEditMessage from "../../hooks/api/useEditMessage.ts";
import useReactToMessage from "../../hooks/api/useReactToMessage.ts";
import { FileStorageContext } from "../../providers/FileStorageProvider.tsx";
import useUserStore from "../../state/useUserStore.ts";
import { cn } from "../../utils/utils.ts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/DropdownMenu.tsx";
import IconButton from "../ui/IconButton.tsx";
import UserTag from "./UserTag.tsx";
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

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
	const { mutateAsync: deleteMessage } = useDeleteMessage();
	const [isEditing, setIsEditing] = useState(false);
	const [editedMarkdown, setEditedMarkdown] = useState(
		message.content?.markdown || "",
	);
	const { chatId } = useParams();
	const editInputRef = useRef<HTMLTextAreaElement>(null);
	const [reactionsAreOpen, setReactionsAreOpen] = useState(false);
	const { mutateAsync: react } = useReactToMessage();
	const { storage } = use(FileStorageContext);

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

	const handleDeleteMessage = async () => {
		await deleteMessage({
			messageId: message._id,
			chatId: message.chat,
		});
		if (message.content.files.length) {
			for (const file of message.content.files) {
				await storage.deleteFile(BUCKET_ID, file);
			}
		}
		if (replyingTo._id === message._id) {
			setReplyingTo(null);
		}
	};

	if (message.type === "renameChat") {
		return (
			<p className="text-muted text-center w-full">
				<strong>{message.user.firstName} </strong>
				renamed the group to
				<strong> {message.newChatName}</strong>
			</p>
		);
	}

	if (message.type === "leaveChat") {
		return (
			<p className="text-muted text-center w-full">
				<strong>{message.user.firstName} </strong>
				left the chat.
			</p>
		);
	}

	return (
		<div
			key={message._id}
			className={cn([
				message.replyTo &&
					"ml-2 relative after:content-[''] after:absolute after:w-px after:h-full after:-left-2 after:top-0 after:bg-white",
			])}
		>
			<div className={cn(["group w-full"])}>
				<div className="flex gap-2 items-center">
					<div className="rounded-full overflow-hidden h-[32px] aspect-square">
						<img
							src="https://picsum.photos/32"
							className="h-full w-full object-cover"
							alt=""
						/>
					</div>
					<span className="text-white">
						{message.user.firstName} {message.user.lastName}
					</span>
				</div>
				{message.replyTo?.user?.firstName && (
					<div className="text-muted mt-2 flex items-center gap-2">
						<div className="h-4 [&_svg]:h-full">
							<ReplyIcon />
						</div>
						<UserTag user={message.replyTo.user} className="text-sm" />
						<span className="text-muted/50 text-sm">
							{message.replyTo?.content?.markdown}
						</span>
					</div>
				)}

				<div className="flex gap-2  items-center">
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
						<MessageFiles files={message.content.files} />
					</div>
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
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger className="cursor-pointer [&_svg]:fill-muted">
							<IconButton icon="ellipsis" className="h-[24px] w-[24px] p-1.5" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="bg-primary border-border text-muted">
							{isMine && (
								<DropdownMenuItem
									onClick={() => {
										setIsEditing(true);
										setEditedMarkdown(message.content?.markdown);
									}}
									className="flex items-center gap-2 hover:text-white cursor-pointer transition"
								>
									<EditIcon />
									Edit
								</DropdownMenuItem>
							)}
							{isMine && (
								<DropdownMenuItem
									asChild
									className="flex w-full items-center gap-2 hover:text-white cursor-pointer transition"
								>
									<button type="button" onClick={handleDeleteMessage}>
										<TrashIcon />
										Delete
									</button>
								</DropdownMenuItem>
							)}
							<DropdownMenuItem
								asChild
								className="flex w-full items-center gap-2 hover:text-white cursor-pointer transition"
							>
								<button type="button" onClick={() => setReplyingTo(message)}>
									<ReplyIcon />
									Reply
								</button>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
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

function MessageMarkdown({ message }: MessageMarkdownProps) {
	return (
		<div className={cn(["text-white rounded-xl p-2"])}>
			<p>
				{message.content?.markdown}{" "}
				{message.edited && (
					<span className="text-muted/50 text-xs italic">Edited</span>
				)}
			</p>
		</div>
	);
}

type MessageFilesProps = {
	files: TMessage["content"]["files"];
};

function MessageFiles({ files }: MessageFilesProps) {
	const { storage } = use(FileStorageContext);
	const [previews, setPreviews] = useState<
		{
			previewUrl: string;
			fileId: string;
			mimeType: string;
			name: string;
			sizeOriginal: number;
		}[]
	>([]);

	useEffect(() => {
		const loadPreviews = async () => {
			const previewUrls = await Promise.all(
				files.map(async (file) => {
					const { mimeType, name, sizeOriginal } = await storage.getFile(
						BUCKET_ID,
						file,
					);
					return {
						previewUrl: storage.getFileView(BUCKET_ID, file),
						fileId: file,
						mimeType,
						name,
						sizeOriginal,
					};
				}),
			);
			setPreviews(previewUrls);
		};

		loadPreviews();
	}, [files, storage]);

	const handleDownloadFile = (fileId: string) => {
		const downloadUrl = storage.getFileDownload(BUCKET_ID, fileId);
		const a = document.createElement("a");
		a.href = downloadUrl;
		a.download = downloadUrl;
		a.click();
	};

	return (
		<div className="flex flex-wrap gap-3">
			{previews.map((preview) => (
				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
				<div
					onClick={() => handleDownloadFile(preview.fileId)}
					key={preview.fileId}
					className="h-30 w-30 rounded-xl overflow-hidden relative group/preview cursor-pointer"
				>
					{preview.mimeType.startsWith("image") ? (
						<img
							className="h-full w-full object-cover group-hover/preview:brightness-30 group-hover/preview:blur-xs transition"
							src={preview.previewUrl}
							alt=""
						/>
					) : (
						// TODO: handle other mime types and display icons accordingly
						<div className="h-full [&_svg]:h-full group-hover/preview:brightness-30 group-hover/preview:blur-xs transition flex flex-col">
							<TxtFileIcon />
							<span className="text-muted text-center text-ellipsis">
								{preview.name}
							</span>
						</div>
					)}
					<div className="z-40 absolute top-1/2 left-1/2 w-1/2 h-1/2 -translate-1/2 opacity-0  group-hover/preview:opacity-100 transition">
						<DownloadIcon />
					</div>
				</div>
			))}
		</div>
	);
}
