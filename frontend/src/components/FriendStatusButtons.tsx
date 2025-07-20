import { cn } from "@/lib/utils.ts";
import {
	isFriend,
	isIncomingRequest,
	isPendingRequest,
} from "../../../shared/functions/utils.tsx";
import type { FriendRequestAction, User } from "../../../shared/types.ts";
import useFriendRequest from "../hooks/api/useFriendRequest.ts";

export default function FriendStatusButtons({
	contactId,
	thisUser,
	className = "",
	shortAccept = false,
}: {
	contactId: User["_id"];
	thisUser: User;
	className?: string;
	shortAccept?: boolean;
}) {
	const { mutateAsync } = useFriendRequest();

	function BaseButton({
		text,
		action,
	}: { text: string; action: FriendRequestAction }) {
		return (
			<button
				type="button"
				onClick={async () =>
					await mutateAsync({
						receiverId: contactId,
						action,
					})
				}
				className={cn([
					"bg-background px-3 py-1 rounded-[5px] cursor-pointer text-primary border border-border",
					["cancel", "decline"].includes(action) && "bg-red-500",
					className,
				])}
			>
				{text}
			</button>
		);
	}

	if (isFriend(contactId, thisUser)) {
		return <BaseButton action={"unfriend"} text="Unfriend" />;
	}

	if (isPendingRequest(contactId, thisUser)) {
		return <BaseButton action={"cancel"} text="Cancel Request" />;
	}

	if (isIncomingRequest(contactId, thisUser)) {
		return (
			<div className="flex gap-3">
				<BaseButton
					action={"accept"}
					text={shortAccept ? "Accept" : "Accept Friend Request"}
				/>
				<BaseButton action={"decline"} text="Decline" />
			</div>
		);
	}

	return <BaseButton action={"send"} text="Add Friend" />;
}
