import { useShallow } from "zustand/react/shallow";
import type { Chat } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";
import UserCard from "../UserCard.tsx";

type ChatPreviewProps = {
	chat: Chat;
};

export default function ChatPreview({ chat }: ChatPreviewProps) {
	const thisUserId = useUserStore(useShallow((state) => state.user?._id));

	if (chat.type === "single") {
		const otherUser = chat.users.find((u) => u._id !== thisUserId);

		if (!otherUser) return;

		return (
			<UserCard
				user={otherUser}
				bottomText={"Last message goes here..."}
				showUsername={false}
				navigateTo={chat._id}
			/>
		);
	}
}
