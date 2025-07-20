import FriendStatusButtons from "@/components/FriendStatusButtons.tsx";
import UserCard from "@/components/UserCard.tsx";
import useUserStore from "@/state/useUserStore.ts";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Notification as TNotification } from "../../../shared/types.ts";

type NotificationProps = {
	notification: Pick<TNotification, "_id" | "type" | "from" | "chatId">;
};

export default function Notification({ notification }: NotificationProps) {
	const thisUser = useUserStore(useShallow((state) => state.user));
	const navigate = useNavigate();

	if (!thisUser) return;

	if (notification.type === "friendRequest") {
		return (
			<div className="flex items-center gap-1">
				<UserCard user={notification.from} showUsername={false} />
				<span className="mr-1">sent you a friend request.</span>
				<FriendStatusButtons
					contactId={notification.from._id}
					thisUser={thisUser}
					shortAccept
				/>
			</div>
		);
	}

	if (notification.type === "addedToGroup") {
		return (
			<button
				type="button"
				onClick={() => navigate(`/chats/${notification.chatId}`)}
				className="flex items-center gap-1 cursor-pointer"
			>
				<UserCard user={notification.from} showUsername={false} />
				<span className="-ml-1">added you to group.</span>
			</button>
		);
	}
}
