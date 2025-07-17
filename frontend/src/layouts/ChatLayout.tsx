import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";
import { SidebarIcon } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import type { Message as TMessage } from "../../../shared/types.ts";
import { PlusIcon } from "../assets/icons/icons.tsx";
import ChatPreview from "../components/chat/ChatPreview.tsx";
import MessageInput from "../components/chat/MessageInput.tsx";
import useChats from "../hooks/api/useChats.ts";
import useCreateChat from "../hooks/api/useCreateChat.ts";
import { cn } from "../utils/utils.ts";

export default function ChatLayout() {
	const [replyingTo, setReplyingTo] = useState<TMessage | null>(null);
	const { chatId } = useParams();
	const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

	return (
		<div className="flex flex-col lg:flex-row">
			<div className="lg:hidden">
				<Sheet open={sidebarIsOpen} onOpenChange={setSidebarIsOpen}>
					<SheetTrigger className="mr-auto m-2">
						<SidebarIcon />
					</SheetTrigger>
					<SheetContent side="left">
						<ChatSidebar setSidebarIsOpen={setSidebarIsOpen} className="mt-2" />
					</SheetContent>
				</Sheet>
			</div>
			<ChatSidebar
				setSidebarIsOpen={setSidebarIsOpen}
				className="hidden lg:block min-w-[320px]"
			/>
			<div className="w-full h-[calc(100vh-90px)] flex flex-col relative">
				{chatId && (
					<div>
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

type ChatSidebarProps = {
	setSidebarIsOpen?: Dispatch<SetStateAction<boolean>>;
	className?: string;
};

function ChatSidebar({ setSidebarIsOpen, className = "" }: ChatSidebarProps) {
	const [activeChatType, setActiveChatType] = useState<"direct" | "groups">(
		"direct",
	);
	const { mutateAsync: createChat } = useCreateChat();
	const { data: chats } = useChats();
	const { chatId } = useParams();

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

	return (
		<div
			className={cn(["h-full bg-background border-r border-border", className])}
		>
			<div className="py-5 px-6 flex gap-4">
				<h3 className="font-bold text-2xl mr-auto text-primary">Chats</h3>
			</div>
			{/*<div className="flex items-center gap-2 [&_svg]:fill-muted relative px-6">*/}
			{/*	<span className="absolute top-1/2 -translate-y-1/2 left-9 [&_svg]:p-[1px]">*/}
			{/*		<SearchIcon />*/}
			{/*	</span>*/}
			{/*	<input*/}
			{/*		type="text"*/}
			{/*		className="w-full placeholder:text-muted pl-10 py-2 transition-all rounded-full focus-visible:bg-background focus-visible:outline-none text-muted outline-border outline-1"*/}
			{/*		placeholder="Search messages..."*/}
			{/*	/>*/}
			{/*</div>*/}
			<div className="m-6 mt-0 flex ">
				<button
					type="button"
					className={cn([
						"cursor-pointer px-3 py-0.5 rounded-xl",
						activeChatType === "direct" && "bg-foreground text-secondary",
					])}
					onClick={() => setActiveChatType("direct")}
				>
					Direct
				</button>
				<button
					type="button"
					className={cn([
						"cursor-pointer  px-3 py-0.5 rounded-xl",
						activeChatType === "groups" && "bg-foreground text-secondary",
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
						className="flex items-center text-primary gap-2 w-full outline-muted-foreground outline-[1px] rounded-xl cursor-pointer py-2 justify-center transition"
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
			<div className="flex flex-col p-6 pt-0 mt-6">
				{(activeChatType === "direct" ? directChats : groups)?.map((chat) => (
					// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
					<div key={chat._id} onClick={() => setSidebarIsOpen?.(false)}>
						<ChatPreview key={chat._id} chat={chat} />
					</div>
				))}
			</div>
		</div>
	);
}
