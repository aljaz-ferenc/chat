import useDeleteMessage from "@/hooks/api/useDeleteMessage.ts";
import { FileStorageContext } from "@/providers/FileStorageProvider.tsx";
import { cn } from "@/utils/utils.ts";
import { EditIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, use } from "react";
import type { Message } from "../../../../shared/types.ts";
import { ReplyIcon, TrashIcon } from "../../assets/icons/icons.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/DropdownMenu.tsx";
import IconButton from "../ui/IconButton.tsx";

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

type MessageDropdownMenuProps = {
	isMine: boolean;
	isEditing: boolean;
	setIsEditing: Dispatch<SetStateAction<boolean>>;
	message: Message;
	replyingTo: Message;
	setReplyingTo: Dispatch<SetStateAction<Message | null>>;
	setEditedMarkdown: Dispatch<SetStateAction<string>>;
};

export default function MessageDropdownMenu({
	isMine,
	isEditing,
	setIsEditing,
	message,
	replyingTo,
	setReplyingTo,
	setEditedMarkdown,
}: MessageDropdownMenuProps) {
	const { mutateAsync: deleteMessage } = useDeleteMessage();
	const { storage } = use(FileStorageContext);

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
		if (replyingTo?._id === message?._id) {
			setReplyingTo(null);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(["cursor-pointer", isEditing && "hidden"])}
			>
				<IconButton
					asDiv
					icon="ellipsis"
					className="h-[24px] w-[24px] p-1.5 bg-transparent [&_svg]:fill-muted"
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-background border-border text-muted">
				{isMine && (
					<DropdownMenuItem
						onClick={() => {
							setIsEditing(true);
							setEditedMarkdown(message.content?.markdown);
						}}
						className="flex items-center gap-2 text-primary cursor-pointer transition"
					>
						<EditIcon />
						Edit
					</DropdownMenuItem>
				)}
				{isMine && (
					<DropdownMenuItem
						asChild
						className="flex w-full items-center gap-2 text-primary cursor-pointer transition"
					>
						<button type="button" onClick={handleDeleteMessage}>
							<TrashIcon />
							Delete
						</button>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem
					asChild
					className="flex w-full items-center gap-2 text-primary cursor-pointer transition"
				>
					<button type="button" onClick={() => setReplyingTo(message)}>
						<ReplyIcon />
						Reply
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
