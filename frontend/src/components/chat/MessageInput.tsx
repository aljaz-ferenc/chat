import { ID } from "appwrite";
import {
	type ChangeEvent,
	type Dispatch,
	type RefObject,
	type SetStateAction,
	use,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Message } from "../../../../shared/types.ts";
import { PlusIcon } from "../../assets/icons/icons.tsx";
import useCreateMessage from "../../hooks/api/useCreateMessage";
import useIsTyping from "../../hooks/useIsTyping.tsx";
import { FileStorageContext } from "../../providers/FileStorageProvider.tsx";
import { SocketContext } from "../../providers/SocketProvider.tsx";
import useUserStore from "../../state/useUserStore";
import FileIcon, { type MimeType } from "../FileIcon.tsx";
import IconButton from "../ui/IconButton";
import EmojiPickerPopover from "./EmojiPicker.tsx";

type MessageInputProps = {
	replyingTo: Message | null;
	setReplyingTo: Dispatch<SetStateAction<Message | null>>;
};

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export default function MessageInput({
	replyingTo,
	setReplyingTo,
}: MessageInputProps) {
	const [markdown, setMarkdown] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const { mutateAsync: createMessage } = useCreateMessage();
	const [userId, user] = useUserStore(
		useShallow((state) => [state.user?._id, state.user]),
	);
	const { chatId } = useParams();
	const isTyping = useIsTyping(inputRef as RefObject<HTMLElement>, 500);
	const socket = use(SocketContext);
	const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false);
	const { storage } = use(FileStorageContext);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [newFiles, setNewFiles] = useState<(File & { id: string })[]>([]);

	useEffect(() => {
		socket?.emit("typing", {
			isTyping,
			userId,
			chatId,
			firstName: user?.firstName,
		});
	}, [isTyping, socket, userId, chatId, user]);

	useEffect(() => {
		if (replyingTo) {
			setTimeout(() => inputRef.current?.focus(), 10);
		}
	}, [replyingTo]);

	useEffect(() => {
		if (!chatId) return;
		setNewFiles([]);
	}, [chatId]);

	const sendMessage = useCallback(async () => {
		if (!userId || !chatId || (!markdown && newFiles.length === 0)) return;

		try {
			const uploadedFiles = await Promise.all(
				newFiles.map((file) =>
					storage.createFile(BUCKET_ID, ID.unique(), file),
				),
			);

			await createMessage({
				user: userId,
				chat: chatId,
				content: {
					markdown,
					files: uploadedFiles.map((file) => file.$id),
				},
				replyTo: replyingTo ? replyingTo._id : null,
				type: "userMessage",
			}).then(() => {
				setMarkdown("");
				setReplyingTo(null);
				setNewFiles([]);
			});
		} catch (error) {
			console.error(error);
		}
	}, [
		chatId,
		markdown,
		userId,
		createMessage,
		replyingTo,
		setReplyingTo,
		newFiles,
		storage,
	]);

	const handleKeyPress = useCallback(
		async (e: KeyboardEvent) => {
			if (
				document.activeElement === inputRef.current &&
				(e.code === "Enter" || e.code === "NumpadEnter")
			) {
				await sendMessage();
			}
		},
		[sendMessage],
	);

	const handleAddFile = (e: ChangeEvent<HTMLInputElement>) => {
		const file: File | undefined = e.target.files?.[0];
		if (file) {
			const appFile = Object.assign(file, { id: crypto.randomUUID() });
			setNewFiles((prev) => [...prev, appFile]);
		}
		e.target.value = "";
	};

	useEffect(() => {
		addEventListener("keypress", handleKeyPress);
		return () => removeEventListener("keypress", handleKeyPress);
	}, [handleKeyPress]);

	return (
		<div className="bg-primary border-t border-border p-2 absolute bottom-0 left-0 right-0 pb-3">
			{replyingTo && (
				<div className="text-muted/50 mb-3 flex items-center gap-2">
					<button
						type="button"
						onClick={() => setReplyingTo(null)}
						className="rotate-45 cursor-pointer h-6 w-6 [&_svg]:h-full"
					>
						<PlusIcon />
					</button>
					<span className="text-sm">
						@{replyingTo.user.firstName} {replyingTo.user.lastName}:{" "}
						{replyingTo.content.markdown}
					</span>
				</div>
			)}
			<div className="flex flex-col justify-start mb-2 gap-3 w-full max-w-60">
				{newFiles.map((file) => (
					<div
						className="border border-muted/50 rounded-md text-white p-3 gap-3 flex items-center w-full relative"
						key={file.id}
					>
						<IconButton
							icon="close"
							className="absolute top-1 right-1 h-5 w-5 p-1"
							onClick={() =>
								setNewFiles((prev) => prev.filter((f) => f.id !== file.id))
							}
						/>
						<div className="flex-shrink-0 h-15 w-10">
							<FileIcon
								extension={file.name.split(".").slice(-1)[0] as MimeType}
							/>
						</div>
						<div className="flex flex-col overflow-hidden w-full">
							<span className="truncate block text-sm">{file.name}</span>
						</div>
					</div>
				))}
			</div>

			<div className="flex items-center gap-5">
				<EmojiPickerPopover
					onOpenChange={(open) => setEmojiPickerIsOpen(open)}
					isOpen={emojiPickerIsOpen}
					onSelect={(emoji) => {
						setMarkdown((prev) => prev + emoji);
						setEmojiPickerIsOpen(false);
					}}
				/>
				<IconButton
					icon="image"
					onClick={() => fileInputRef.current?.click()}
				/>
				<input
					type="file"
					className="hidden"
					ref={fileInputRef}
					onChange={handleAddFile}
				/>
				<textarea
					className="w-full h-full text-white p-2 bg-background rounded"
					value={markdown}
					onChange={(e) => setMarkdown(e.target.value)}
					ref={inputRef}
				/>
				<IconButton icon="send" onClick={sendMessage} />
			</div>
		</div>
	);
}
