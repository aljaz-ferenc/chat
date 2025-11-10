import { ReplyIcon } from "@/assets/icons/icons.tsx";
import useLeaveChat from "@/hooks/api/useLeaveChat.ts";
import { EditIcon, UserIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router";
import type { Chat } from "../../../../../shared/types.ts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../ui/DropdownMenu.tsx";
import IconButton from "../../ui/IconButton.tsx";

type GroupChatDropdownMenuProps = {
	chat: Chat;
	setAddFriendsIsOpen: Dispatch<SetStateAction<boolean>>;
	setRenameDialogIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function GroupChatDropdownMenu({
	chat,
	setRenameDialogIsOpen,
	setAddFriendsIsOpen,
}: GroupChatDropdownMenuProps) {
	const { mutateAsync: leaveChat } = useLeaveChat();
	const navigate = useNavigate();

	return (
		<DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    onClick={(e) => e.preventDefault()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className='ml-auto'
                >
                    <IconButton
                        icon="ellipsis"
                        className="h-[24px] w-[24px] p-1.5 ml-auto cursor-pointer"
                    />
                </div>
            </DropdownMenuTrigger>
			<DropdownMenuContent className="p-2 border-border text-primary">
				<DropdownMenuItem
					onClick={(e) => e.stopPropagation()}
					onSelect={() => {
						setAddFriendsIsOpen(true);
					}}
					className="flex items-center gap-2 cursor-pointer transition"
				>
					<UserIcon color={"var(--primary)"} />
					Add Friends
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={() => setRenameDialogIsOpen(true)}
					onClick={(e) => e.stopPropagation()}
					className="flex items-center gap-2 cursor-pointer transition"
				>
					<EditIcon color={"var(--primary)"} />
					Rename Group
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => e.stopPropagation()}
					onSelect={async () => {
						await leaveChat(chat._id);
						navigate("/chats");
					}}
					className="[&_svg]:fill-primary flex items-center gap-2 cursor-pointer transition"
				>
					<ReplyIcon />
					Leave Group
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
