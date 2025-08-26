import NewFiles from "@/components/chat/MessageInput/NewFiles.tsx";
import NewGifs from "@/components/chat/MessageInput/NewGifs.tsx";
import ReplyingTo from "@/components/chat/MessageInput/ReplyingTo.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { cn } from "@/lib/utils.ts";
import { FileStorageContext } from "@/providers/FileStorageProvider.tsx";
import { SocketContext } from "@/providers/SocketProvider.tsx";
import type { IGif } from "@giphy/js-types";
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
import type { Message } from "../../../../../shared/types.ts";
import useCreateMessage from "../../../hooks/api/useCreateMessage.ts";
import useIsTyping from "../../../hooks/useIsTyping.tsx";
import useUserStore from "../../../state/useUserStore.ts";
import IconButton from "../../ui/IconButton.tsx";
import EmojiPickerPopover from "../EmojiPicker.tsx";
import Giphy from "../Giphy.tsx";

type MessageInputProps = {
	replyingTo: Message | null;
	setReplyingTo: Dispatch<SetStateAction<Message | null>>;
	className?: string;
};

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export default function MessageInput({
	replyingTo,
	setReplyingTo,
	className = "",
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
	const [gifs, setGifs] = useState<IGif[]>([]);
	const [gifsOpen, setGifsOpen] = useState(false);

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
		setMarkdown("");
		setGifs([]);
		setNewFiles([]);
	}, [chatId]);

	const sendMessage = useCallback(async () => {
		if (
			!userId ||
			!chatId ||
			(!markdown && newFiles.length === 0 && gifs.length === 0)
		)
			return;

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
					gifs,
				},
				replyTo: replyingTo ? replyingTo._id : null,
				type: "userMessage",
			}).then(() => {
				setMarkdown("");
				setReplyingTo(null);
				setNewFiles([]);
				setGifs([]);
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
		gifs,
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
		<div className={cn(["p-2 pb-3 z-20 bg-background", className])}>
			{replyingTo && (
				<ReplyingTo setReplyingTo={setReplyingTo} message={replyingTo} />
			)}
			<div className="flex flex-col justify-start gap-3 w-full max-w-60 mb-1">
				<NewFiles setNewFiles={setNewFiles} newFiles={newFiles} />
				<NewGifs setGifs={setGifs} gifs={gifs} />
			</div>
			<div className="flex items-end border-1 border-border rounded-2xl p-4 gap-8 bg-card">
				<div className="flex items-center gap-3 mb-[1ex]">
					<EmojiPickerPopover
						className="hidden md:block"
						onOpenChange={(open) => setEmojiPickerIsOpen(open)}
						isOpen={emojiPickerIsOpen}
						onSelect={(emoji) => {
							setMarkdown((prev) => prev + emoji);
							setEmojiPickerIsOpen(false);
						}}
					/>
					<IconButton
						icon="attachment"
						onClick={() => fileInputRef.current?.click()}
						className="border-none h-5 p-0 bg-transparent"
					/>
					<Giphy
						open={gifsOpen}
						setOpen={setGifsOpen}
						onGifSelect={(gif) => {
							setGifs((prev) => [...prev, gif]);
							setGifsOpen(false);
						}}
					/>
				</div>
				<input
					type="file"
					className="hidden"
					ref={fileInputRef}
					onChange={handleAddFile}
				/>
				<Textarea
					spellCheck={false}
					placeholder="Write a message..."
					className="h-full shadow-none text-base resize-none field-sizing-content flex md:min-h-[2ex] min-h-[1ex] w-full rounded-md bg-transparent px-0 py-2  text-primary placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0"
					value={markdown}
					onChange={(e) => setMarkdown(e.target.value)}
					ref={inputRef}
				/>
				<IconButton
					shape="rect"
					icon="send"
					onClick={sendMessage}
					className="md:h-9.5 h-8 mb-[0.5ex] md:mb-0 bg-foreground [&_svg]:!fill-foreground [&_svg]:!stroke-background p-2"
				/>
			</div>
		</div>
	);
}
