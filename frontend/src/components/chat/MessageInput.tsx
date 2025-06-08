import {
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
import { SocketContext } from "../../providers/SocketProvider.tsx";
import useUserStore from "../../state/useUserStore";
import IconButton from "../ui/IconButton";

type MessageInputProps = {
	replyingTo: Message | null;
	setReplyingTo: Dispatch<SetStateAction<Message | null>>;
};

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

	const handleKeyPress = useCallback(
		async (e: KeyboardEvent) => {
			if (
				document.activeElement === inputRef.current &&
				(e.code === "Enter" || e.code === "NumpadEnter")
			) {
				if (!userId || !chatId) return;
				await createMessage({
					user: userId,
					chat: chatId,
					content: {
						markdown,
					},
					replyTo: replyingTo ? replyingTo._id : null,
				}).then(() => {
					setMarkdown("");
					setReplyingTo(null);
				});
			}
		},
		[chatId, markdown, createMessage, userId, replyingTo, setReplyingTo],
	);

	useEffect(() => {
		addEventListener("keypress", handleKeyPress);
		return () => removeEventListener("keypress", handleKeyPress);
	}, [handleKeyPress]);

	return (
		<div className=" bg-primary border-t border-border p-2">
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
			<div className="flex items-center gap-5">
				<textarea
					className="w-full h-full text-white p-2 bg-background rounded"
					value={markdown}
					onChange={(e) => setMarkdown(e.target.value)}
					ref={inputRef}
				/>
				<IconButton icon="message" />
			</div>
		</div>
	);
}
