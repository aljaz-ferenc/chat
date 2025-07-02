import { EditIcon, UserIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import type { Chat, User } from "../../../../shared/types.ts";
import { ReplyIcon } from "../../assets/icons/icons.tsx";
import useAddUsersToChat from "../../hooks/api/useAddUsersToChat.ts";
import useLeaveChat from "../../hooks/api/useLeaveChat.ts";
import useRenameChat from "../../hooks/api/useRenameChat.ts";
import useUserStore from "../../state/useUserStore.ts";
import { cn } from "../../utils/utils.ts";
import UserCard from "../UserCard.tsx";
import { Checkbox } from "../ui/Checkbox.tsx";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/Dialog.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/DropdownMenu.tsx";
import IconButton from "../ui/IconButton.tsx";
import { Label } from "../ui/Label.tsx";

type ChatPreviewProps = {
	chat: Chat;
};

export default function ChatPreview({ chat }: ChatPreviewProps) {
	const [thisUserId, thisUser] = useUserStore(
		useShallow((state) => [state.user?._id, state.user]),
	);
	const [checkedUsers, setCheckedUsers] = useState<User["_id"][]>([]);
	const [addFriendsIsOpen, setAddFriendsIsOpen] = useState(false);
	const [renameDialogIsOpen, setRenameDialogIsOpen] = useState(false);
	const [groupName, setGroupName] = useState("");
	const { mutateAsync: addUsersToChat } = useAddUsersToChat();
	const { mutateAsync: renameChat } = useRenameChat();
	const { mutateAsync: leaveChat } = useLeaveChat();
	const { chatId } = useParams();

	const usersIds = useMemo(() => {
		return chat.users.map((u) => u._id);
	}, [chat]);

	const friendsNotInChat = useMemo(() => {
		if (!thisUser) return;
		return thisUser.friends.friends.filter((u) => !usersIds.includes(u._id));
	}, [thisUser, usersIds]);

	if (chat.type === "group") {
		return (
			<>
				<Link
					to={`/chats/${chat._id}`}
					className={cn([
						"flex items-center gap-4 w-full p-2 rounded-xl",
						chatId === chat._id && "bg-background",
					])}
				>
					<div className="flex mr-2 h-8">
						{chat.users.slice(0, 3).map((user) => (
							<img
								key={user._id}
								src={user.imageUrl}
								alt="user"
								className="-mr-4 w-8 min-w-8 aspect-square rounded-full border-2 border-background"
							/>
						))}
					</div>
					<div className="flex flex-col items-start gap-1 w-full">
						<div className="flex items-center w-full ">
							<h3 className="font-bold text-white text-ellipsis truncate">
								{chat.name
									? chat.name
									: chat.users
											.slice(0, 3)
											.map((u) => u.firstName)
											.join(", ")}
							</h3>
							<DropdownMenu>
								<DropdownMenuTrigger className="ml-auto cursor-pointer [&_svg]:fill-muted">
									<IconButton
										icon="ellipsis"
										className="h-[24px] w-[24px] p-1.5"
									/>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="p-2 bg-primary border-border text-muted">
									<DropdownMenuItem
										onSelect={() => setAddFriendsIsOpen(true)}
										className="flex items-center gap-2 hover:text-white cursor-pointer transition"
									>
										<UserIcon />
										Add Friends
									</DropdownMenuItem>
									<DropdownMenuItem
										onSelect={() => setRenameDialogIsOpen(true)}
										className="flex items-center gap-2 hover:text-white cursor-pointer transition"
									>
										<EditIcon />
										Rename Group
									</DropdownMenuItem>
									<DropdownMenuItem
										onSelect={async () => await leaveChat(chat._id)}
										className="flex items-center gap-2 hover:text-white cursor-pointer transition"
									>
										<ReplyIcon />
										Leave Group
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</Link>

				{/* Add Friends Dialog */}
				<Dialog open={addFriendsIsOpen} onOpenChange={setAddFriendsIsOpen}>
					<DialogContent className="bg-primary text-muted">
						<DialogHeader>
							<DialogTitle>Add Friends to Group</DialogTitle>
						</DialogHeader>
						{friendsNotInChat && friendsNotInChat.length > 0 ? (
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
							))
						) : (
							<span>All your friends are already in the group.</span>
						)}
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

				{/* Rename Group Dialog */}
				<Dialog open={renameDialogIsOpen} onOpenChange={setRenameDialogIsOpen}>
					<DialogContent className="bg-primary text-muted">
						<DialogHeader>
							<DialogTitle>Rename Group</DialogTitle>
						</DialogHeader>
						<input
							type="text"
							className="w-full bg-background text-white p-2 rounded"
							placeholder="New group name"
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
						/>
						<DialogFooter className="[&_svg]:h-5">
							<button
								type="button"
								className="border-1 text-base hover:bg-background cursor-pointer transition rounded-xl px-3 py-1 flex items-center gap-1"
								onClick={async () => {
									await renameChat(groupName);
									setRenameDialogIsOpen(false);
									setGroupName("");
								}}
							>
								<span>Rename</span>
							</button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</>
		);
	}

	if (chat.type === "single") {
		const otherUser = chat.users.find((u) => u._id !== thisUserId);
		if (!otherUser) return null;

		const bottomText = chat.lastMessage?.content.markdown
			? chat.lastMessage?.content.markdown
			: !chat.lastMessage?.content.markdown &&
					chat.lastMessage?.content.files.length
				? `${otherUser.firstName} sent a file`
				: "";

		return (
			<div className="flex justify-between items-center">
				<UserCard
					user={otherUser}
					bottomText={bottomText}
					showUsername={false}
					navigateTo={chat._id}
					className={cn([
						"w-full p-2",
						chat._id === chatId && "bg-background rounded-xl",
					])}
				/>
				{thisUserId && !chat.readBy.includes(thisUserId) && (
					<div className="h-3 w-3 bg-red-500 rounded-full" />
				)}
			</div>
		);
	}
}
