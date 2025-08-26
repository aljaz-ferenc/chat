import { cn } from "@/utils/utils.ts";
import type { Message } from "../../../../../shared/types.ts";

type MessageMarkdownProps = {
	message: Message;
	isMine: boolean;
};

export default function MessageMarkdown({ message }: MessageMarkdownProps) {
	return (
		<div className={cn(["text-primary rounded-xl p-2"])}>
			<p>
				{message.content?.markdown}{" "}
				{message.edited && (
					<span className="text-muted-foreground text-xs italic font-semibold inline-block ml-2">
						Edited
					</span>
				)}
			</p>
		</div>
	);
}
