import UserCard from "@/components/UserCard.tsx";
import useUserStore from "@/state/useUserStore.ts";
import { cn } from "@/utils/utils.ts";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Chat } from "../../../../../shared/types.ts";

type DirectChatPreviewProps = {
	chat: Chat;
};

export default function DirectChatPreview({ chat }: DirectChatPreviewProps) {
	const { chatId } = useParams();
	const [thisUserId] = useUserStore(
		useShallow((state) => [state.user?._id, state.user]),
	);
	const otherUser = chat.users.find((u) => u._id !== thisUserId);
	if (!otherUser) return null;

	const bottomText = chat.lastMessage?.content.markdown
		? `${chat.lastMessage.user._id === thisUserId ? "You: " : ""}${chat.lastMessage?.content.markdown}`
		: !chat.lastMessage?.content.markdown &&
				chat.lastMessage?.content.files.length
			? `${otherUser.firstName} sent a file`
			: chat.lastMessage?.content.gifs.length
				? `${chat.lastMessage.user.firstName} sent a gif`
				: "";

	return (
		<div className="flex justify-between items-center relative">
			<UserCard
				user={otherUser}
				bottomText={bottomText}
				showUsername={false}
				navigateTo={chat._id}
				className={cn([
					"w-full p-2",
					chat._id === chatId && "bg-foreground text-background rounded-xl",
				])}
			/>
			{/*NEW UNREAD MESSAGE INDEICATOR*/}
			{thisUserId &&
				!chat.readBy.includes(thisUserId) &&
				chat._id !== chatId && (
					<div className="h-3 w-3 bg-red-500 rounded-full absolute top-1/2 right-2 -translate-y-1/2" />
				)}
		</div>
	);
}
