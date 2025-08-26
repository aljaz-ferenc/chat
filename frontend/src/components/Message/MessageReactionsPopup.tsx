import IconButton from "@/components/ui/IconButton.tsx";
import useReactToMessage from "@/hooks/api/useReactToMessage.ts";
import { cn } from "@/utils/utils.ts";
import { FacebookSelector } from "@charkour/react-reactions";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import { useState } from "react";
import type { Message, User } from "../../../../shared/types.ts";

type MessageReactionsPopupProps = {
	isEditing: boolean;
	messageId: Message["_id"];
	userId: User["_id"];
};

export default function MessageReactionsPopup({
	isEditing,
	messageId,
	userId,
}: MessageReactionsPopupProps) {
	const [reactionsAreOpen, setReactionsAreOpen] = useState(false);
	const { mutateAsync: react } = useReactToMessage();

	return (
		<div
			className={cn(["h-full flex items-center z-10", isEditing && "hidden"])}
		>
			<div className="flex gap-2">
				<Popover open={reactionsAreOpen} onOpenChange={setReactionsAreOpen}>
					<PopoverTrigger>
						<IconButton
							asDiv
							icon="emoji"
							className="max-h-6 p-1.5 bg-transparent"
						/>
					</PopoverTrigger>
					<PopoverContent>
						<FacebookSelector
							onSelect={async (reaction) =>
								await react({
									messageId,
									reaction: { emoji: reaction, by: userId },
								}).then(() => setReactionsAreOpen(false))
							}
							iconSize={30}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
