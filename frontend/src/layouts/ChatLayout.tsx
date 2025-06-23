import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import type { Message as TMessage } from "../../../shared/types.ts";
import { FilterIcon, PlusIcon, SearchIcon } from "../assets/icons/icons.tsx";
import ChatPreview from "../components/chat/ChatPreview.tsx";
import MessageInput from "../components/chat/MessageInput.tsx";
// import Spinner from "../components/ui/Spinner.tsx";
import useChats from "../hooks/api/useChats.ts";
import useCreateChat from "../hooks/api/useCreateChat.ts";
import { cn } from "../utils/utils.ts";

export default function ChatLayout() {
	const { data: chats } = useChats();
	const [replyingTo, setReplyingTo] = useState<TMessage | null>(null);
	const { chatId } = useParams();
	const [activeChatType, setActiveChatType] = useState<"direct" | "groups">(
		"direct",
	);
	const { mutateAsync: createChat } = useCreateChat();
	const navigate = useNavigate();
	const directChats = useMemo(() => {
		return chats?.filter((chat) => chat.type === "single");
	}, [chats]);

	const groups = useMemo(() => {
		return chats?.filter((chat) => chat.type === "group");
	}, [chats]);

	useEffect(() => {
		setActiveChatType(() => {
			if (chatId) {
				const currentChat = chats?.find((chat) => chat._id === chatId);
				return currentChat?.type === "single" ? "direct" : "groups";
			}
			return "direct";
		});
	}, [chats, chatId]);

	// if (!chats) {
	// 	return (
	// 		<div className="h-full w-full">
	// 			<Spinner />
	// 		</div>
	// 	);
	// }

	return (
		<div className="flex">
			<div className="min-w-[320px] h-full bg-primary border-r border-border">
				<div className="py-5 px-6 flex gap-4">
					<h3 className="font-bold text-2xl mr-auto text-white">Chats</h3>
					<button
						type="button"
						className="flex gap-2 items-center text-muted [&_svg]:fill-muted font-bold text-xs hover:text-message-primary hover:[&_svg]:fill-message-primary cursor-pointer"
					>
						<PlusIcon />
						<span>New</span>
					</button>
					<button
						type="button"
						className="flex gap-2 items-center text-muted [&_svg]:fill-muted font-bold text-xs hover:text-message-primary hover:[&_svg]:fill-message-primary cursor-pointer"
					>
						<FilterIcon />
						<span>Filter</span>
					</button>
				</div>
				<div className="flex items-center gap-2 [&_svg]:fill-muted relative px-6">
					<span className="absolute top-1/2 -translate-y-1/2 left-9 [&_svg]:p-[1px]">
						<SearchIcon />
					</span>
					<input
						type="text"
						className="w-full placeholder:text-muted pl-10 py-2 transition-all rounded-full focus-visible:bg-background focus-visible:outline-none text-muted outline-border outline-1"
						placeholder="Search messages..."
					/>
				</div>
				<div className="m-6 text-muted flex">
					<button
						type="button"
						className={cn([
							"cursor-pointer px-3 py-0.5 rounded-xl",
							activeChatType === "direct" && "bg-background",
						])}
						onClick={() => setActiveChatType("direct")}
					>
						Direct
					</button>
					<button
						type="button"
						className={cn([
							"cursor-pointer  px-3 py-0.5 rounded-xl",
							activeChatType === "groups" && "bg-background",
						])}
						onClick={() => setActiveChatType("groups")}
					>
						Groups
					</button>
				</div>
				{activeChatType === "groups" && (
					<div className="mx-6">
						<button
							type="button"
							className="flex items-center text-muted gap-2 w-full outline-muted outline-[1px] hover:outline-transparent rounded-xl cursor-pointer py-2 justify-center hover:text-white hover:bg-background transition"
							onClick={async () => {
								await createChat("group").then((data) => {
									navigate(data.chatId);
								});
							}}
						>
							<span className="h-7 w-7">
								<PlusIcon />
							</span>
							<span className="w-max">Create group</span>
						</button>
					</div>
				)}
				<div className="flex flex-col mt-4 p-6 gap-3">
					{(activeChatType === "direct" ? directChats : groups)?.map((chat) => (
						<ChatPreview key={chat._id} chat={chat} />
					))}
				</div>
			</div>

			<div className="w-full bg-primary flex flex-col">
				{chatId && (
					<div className="max-h-[calc(100vh-160px)]">
						<Outlet context={{ replyingTo, setReplyingTo }} />
						<MessageInput
							replyingTo={replyingTo}
							setReplyingTo={setReplyingTo}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
