import UserTag from "@/components/chat/UserTag.tsx";
import { X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Message } from "../../../../../shared/types.ts";

type ReplyingToProps = {
	setReplyingTo: Dispatch<SetStateAction<Message | null>>;
	message: Message;
};

export default function ReplyingTo({
	setReplyingTo,
	message,
}: ReplyingToProps) {
	return (
		<div className="flex flex-col mb-3 gap-3 text-sm text-muted-foreground pt-1">
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
					<UserTag user={message.user} />
				</span>
			</div>
			<span className="ml-2">{message.content.markdown}</span>
		</div>
	);
}
