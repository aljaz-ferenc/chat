import { Outlet } from "react-router";
import { FilterIcon, PlusIcon, SearchIcon } from "../assets/icons/icons.tsx";
import ChatPreview from "../components/chat/ChatPreview.tsx";
import MessageInput from "../components/chat/MessageInput.tsx";
import useChats from "../hooks/api/useChats.ts";

export default function ChatLayout() {
	const { data: chats } = useChats();

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
				<div className="flex flex-col mt-4 p-6">
					{chats?.map((chat) => (
						<ChatPreview key={chat._id} chat={chat} />
					))}
				</div>
			</div>
			<div className="w-full bg-primary flex flex-col">
				<Outlet />
				<MessageInput />
			</div>
		</div>
	);
}
