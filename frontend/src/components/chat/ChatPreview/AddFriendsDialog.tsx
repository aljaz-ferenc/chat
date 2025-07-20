import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog.tsx";
import useAddUsersToChat from "@/hooks/api/useAddUsersToChat.ts";
import { cn } from "@/lib/utils.ts";
import useUserStore from "@/state/useUserStore.ts";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Chat, User } from "../../../../../shared/types.ts";
import { Checkbox } from "../../ui/Checkbox.tsx";
import { Label } from "../../ui/Label.tsx";

type AddFriendsDialogProps = {
	chat: Chat;
	addFriendsIsOpen: boolean;
	setAddFriendsIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AddFriendsDialog({
	chat,
	addFriendsIsOpen,
	setAddFriendsIsOpen,
}: AddFriendsDialogProps) {
	const [checkedUsers, setCheckedUsers] = useState<User["_id"][]>([]);
	const [thisUser] = useUserStore(useShallow((state) => [state.user]));
	const { mutateAsync: addUsersToChat } = useAddUsersToChat();

	const usersIds = useMemo(() => {
		return chat.users.map((u) => u._id);
	}, [chat]);

	const friendsNotInChat = useMemo(() => {
		if (!thisUser) return;
		return thisUser.friends.friends.filter((u) => !usersIds.includes(u._id));
	}, [thisUser, usersIds]);

	return (
		<Dialog open={addFriendsIsOpen} onOpenChange={setAddFriendsIsOpen}>
			<DialogContent className="bg-background text-primary">
				<DialogHeader>
					<DialogTitle>Add Friends to Group</DialogTitle>
				</DialogHeader>
				{friendsNotInChat &&
					friendsNotInChat.length > 0 &&
					friendsNotInChat?.map((friend) => (
						<button
							type="button"
							key={friend._id}
							className={cn([
								"flex items-center justify-between rounded-xl hover:bg-background p-2 px-3 cursor-pointer",
								checkedUsers.includes(friend._id) && "bg-background",
							])}
							onClick={() =>
								setCheckedUsers((prev) =>
									prev.includes(friend._id)
										? prev.filter((u) => u !== friend._id)
										: [...prev, friend._id],
								)
							}
						>
							<Label className="flex items-center gap-2">
								<span>
									{friend.firstName} {friend.lastName}
								</span>
							</Label>
							<Checkbox
								className="cursor-pointer"
								value={friend._id}
								checked={checkedUsers.includes(friend._id)}
							/>
						</button>
					))}
				{friendsNotInChat && friendsNotInChat.length > 0 && (
					<DialogFooter className="[&_svg]:h-5">
						<button
							type="button"
							className="border-1 text-base hover:bg-background cursor-pointer transition rounded-xl px-3 py-1 flex items-center gap-1"
							onClick={async () => {
								await addUsersToChat(checkedUsers);
								setAddFriendsIsOpen(false);
								setCheckedUsers([]);
							}}
						>
							<span>Add</span>
						</button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
