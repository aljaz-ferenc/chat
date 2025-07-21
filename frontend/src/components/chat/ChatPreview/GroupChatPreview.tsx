import AddFriendsDialog from "@/components/chat/ChatPreview/AddFriendsDialog.tsx";
import GroupChatDropdownMenu from "@/components/chat/ChatPreview/GroupChatDropdownMenu.tsx";
import RenameGroupDialog from "@/components/chat/ChatPreview/RenameGroupDialog.tsx";
import { cn } from "@/utils/utils.ts";
import { useState } from "react";
import { Link, useParams } from "react-router";
import type { Chat } from "../../../../../shared/types.ts";

type GroupChatPreviewProps = {
	chat: Chat;
};

export default function GroupChatPreview({ chat }: GroupChatPreviewProps) {
	const [addFriendsIsOpen, setAddFriendsIsOpen] = useState(false);
	const [renameDialogIsOpen, setRenameDialogIsOpen] = useState(false);
	const { chatId } = useParams();

	return (
		<>
			<Link
				to={`/chats/${chat._id}`}
				onClick={() => console.log("click preview")}
				className={cn([
					"flex items-center gap-4 px-2 transition w-full rounded-xl mt-2",
					chatId === chat._id && "bg-foreground h-[64px]",
				])}
			>
				<div className="relative flex flex-col items-center">
					{chat.users.slice(2, 3).map((user) => (
						<img
							key={user._id}
							src={user.imageUrl}
							alt="user"
							className="-mr-4 w-8 min-w-8 aspect-square rounded-full border-2 border-primary/50 -translate-x-0.5 z-0 translate-y-1/4"
						/>
					))}
					<div
						className={cn([
							"flex mr-2 h-8 items-end z-10",
							chat.users.length > 2 && "-translate-y-1/4",
						])}
					>
						{chat.users.slice(0, 2).map((user) => (
							<img
								key={user._id}
								src={user.imageUrl}
								alt="user"
								className="-mr-4 w-8 h-8 min-w-8 aspect-square rounded-full border-2 border-primary/50"
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col items-start gap-1 w-full">
					<div className="flex items-center w-full ">
						<h3
							className={cn([
								"font-bold text-primary text-ellipsis truncate transition",
								chatId === chat._id && "text-background",
							])}
						>
							{chat.name
								? chat.name
								: chat.users
										.slice(0, 3)
										.map((u) => u.firstName)
										.join(", ")}
						</h3>
						<GroupChatDropdownMenu
							chat={chat}
							setAddFriendsIsOpen={setAddFriendsIsOpen}
							setRenameDialogIsOpen={setRenameDialogIsOpen}
						/>
					</div>
				</div>
			</Link>
			<AddFriendsDialog
				chat={chat}
				setAddFriendsIsOpen={setAddFriendsIsOpen}
				addFriendsIsOpen={addFriendsIsOpen}
			/>

			<RenameGroupDialog
				setRenameDialogIsOpen={setRenameDialogIsOpen}
				renameDialogIsOpen={renameDialogIsOpen}
			/>
		</>
	);
}
