import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import useCreateMessage from "../../hooks/api/useCreateMessage";
import useUserStore from "../../state/useUserStore";
import IconButton from "../ui/IconButton";

export default function MessageInput() {
	const [markdown, setMarkdown] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const { mutateAsync: createMessage } = useCreateMessage();
	const userId = useUserStore(useShallow((state) => state.user?._id));
	const { chatId } = useParams();

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
				});
			}
		},
		[chatId, markdown, createMessage, userId],
	);

	useEffect(() => {
		addEventListener("keypress", handleKeyPress);
		return () => removeEventListener("keypress", handleKeyPress);
	}, [handleKeyPress]);

	return (
		<div className="h-[88px] bg-primary border-t border-border p-2">
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
