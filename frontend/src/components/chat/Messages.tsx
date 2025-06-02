import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Message } from "../../../../shared/types.ts";
import useMessages from "../../hooks/api/useMessages.ts";
import useUserStore from "../../state/useUserStore.ts";
import { cn } from "../../utils/utils.ts";

export default function Messages() {
	const { chatId } = useParams();
	const { data: messages } = useMessages(chatId);
	const thisUserId = useUserStore(useShallow((state) => state.user?._id));

	if (!messages) return <div>Loading messages...</div>;
	if (!thisUserId) return <div>User not found...</div>;

	return (
		<div className="h-full flex flex-col gap-5 items-start bg-background w-full p-6">
			{messages.map((message) => {
				const isMine = message.user === thisUserId;

				return (
					<div
						key={message._id}
						className={cn([
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
						<div>
							<MessageMarkdown
								messageId={message._id}
								markdown={message.content.markdown}
								isMine={isMine}
							/>
							<MessageFiles messageId={message._id} />
						</div>
						{!isMine && (
							<div className="flex gap-2">
								<div>react</div>
								<div>Reply</div>
								<div>...</div>
							</div>
						)}
					</div>
				);
			})}
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
