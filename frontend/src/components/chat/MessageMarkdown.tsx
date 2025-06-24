import type { Message } from "../../../../shared/types.ts";
import { cn } from "../../utils/utils.ts";

type MessageMarkdownProps = {
	message: Message;
	isMine: boolean;
};

export default function MessageMarkdown({ message }: MessageMarkdownProps) {
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
