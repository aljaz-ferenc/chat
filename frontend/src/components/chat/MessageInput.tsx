import { Textarea } from "@/components/ui/textarea.tsx";
import { cn } from "@/lib/utils.ts";
import type { IGif } from "@giphy/js-types";
import { Gif } from "@giphy/react-components";
import { ID } from "appwrite";
import { X } from "lucide-react";
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
import useCreateMessage from "../../hooks/api/useCreateMessage";
import useIsTyping from "../../hooks/useIsTyping.tsx";
import { FileStorageContext } from "../../providers/FileStorageProvider.tsx";
import { SocketContext } from "../../providers/SocketProvider.tsx";
import useUserStore from "../../state/useUserStore";
import FileIcon, { type MimeType } from "../FileIcon.tsx";
import IconButton from "../ui/IconButton";
import EmojiPickerPopover from "./EmojiPicker.tsx";
import Giphy from "./Giphy.tsx";

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
		<div className={cn(["bg-card  p-2 pb-3 z-20", className])}>
			{replyingTo && (
				<div className="flex flex-col mb-3 gap-3 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setReplyingTo(null)}
							className="cursor-pointer h-6 w-6 [&_svg]:h-full"
						>
							<X size={15} />
						</button>
						<span className="flex gap-1">
							<span>Reply to</span>
							<span className="bg-muted-foreground text-secondary rounded-xl px-2">
								@{replyingTo.user.firstName} {replyingTo.user.lastName}
							</span>
						</span>
					</div>
					<span className="ml-2">{replyingTo.content.markdown}</span>
				</div>
			)}
			<div className="flex flex-col justify-start gap-3 w-full max-w-60 mb-1">
				{newFiles.map((file) => {
					return (
						<div
							className="border border-border rounded-md text-primary p-3 gap-5 flex items-center w-full relative"
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
								{file.type.startsWith("image") ? (
									<div className="overflow-hidden h-full aspect-[2/2.4] relative rounded">
										<img
											src={URL.createObjectURL(file)}
											alt=""
											className="absolute inset-0 object-cover h-full w-full"
										/>
									</div>
								) : (
									<FileIcon
										extension={file.name.split(".").slice(-1)[0] as MimeType}
									/>
								)}
							</div>
							<div className="flex flex-col overflow-hidden w-full">
								<span className="truncate block text-sm">{file.name}</span>
							</div>
						</div>
					);
				})}
				<div className="flex gap-3">
					{gifs.map((gif, index) => {
						return (
							<div
								key={`input-gif-${index + 1}-${gif.id}`}
								className="relative group"
							>
								<Gif
									className="cursor-auto"
									gif={gif}
									width={200}
									onGifClick={(_gif, event) => event.preventDefault()}
								/>
								<button
									type="button"
									className="opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer absolute h-5 w-5 top-1 right-1 bg-black/50 p-1 rounded-full hover:bg-black/70 transition"
									onClick={() =>
										setGifs((prev) => {
											return prev.filter((g) => g.id !== gif.id);
										})
									}
								>
									<X color="white" size={15} />
								</button>
							</div>
						);
					})}
				</div>
			</div>
			<div className="flex items-end border-1 border-border rounded-2xl p-4 gap-8">
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
					placeholder="Write a message. Be nice..."
					className="h-full shadow-none text-base resize-none field-sizing-content flex min-h-[2ex] w-full rounded-md bg-transparent px-0 py-2  text-primary placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0"
					value={markdown}
					onChange={(e) => setMarkdown(e.target.value)}
					ref={inputRef}
				/>
				<IconButton
					shape="rect"
					icon="send"
					onClick={sendMessage}
					className="h-9.5 bg-foreground [&_svg]:!fill-foreground [&_svg]:!stroke-background p-2"
				/>
			</div>
		</div>
	);
}
