import { PlusIcon } from "@/assets/icons/icons.tsx";
import ChatPreview from "@/components/chat/ChatPreview/ChatPreview.tsx";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet.tsx";
import useChats from "@/hooks/api/useChats.ts";
import useCreateChat from "@/hooks/api/useCreateChat.ts";
import { cn } from "@/lib/utils.ts";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SidebarIcon } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useNavigate, useParams } from "react-router";

type ChatSidebarProps = {
	setSidebarIsOpen?: Dispatch<SetStateAction<boolean>>;
	className?: string;
};

function ChatSidebarBase({
	setSidebarIsOpen,
	className = "",
}: ChatSidebarProps) {
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
			className={cn([
				"min-w-[320px] row-span-2 bg-background h-full border-r border-border",
				className,
			])}
		>
			<div className="py-5 pt-0 md:pt-6 px-3 md:px-6 flex gap-4">
				<h3 className="font-bold text-2xl mr-auto text-primary">Chats</h3>
			</div>
			<div className="px-3 md:px-6 mt-0 flex ">
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
				<div className="mx-6 mt-6">
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
			<div className="flex flex-col px-2 md:px-6 pt-0 mt-2 md:mt-6">
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

//for mobile screens
function ChatSidebarSheet({ className }: { className?: string }) {
	const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

	return (
		<div className={cn(["bg-background z-30", className])}>
			<Sheet open={sidebarIsOpen} onOpenChange={setSidebarIsOpen}>
				<VisuallyHidden>
					<SheetDescription>List of chats</SheetDescription>
					<SheetTitle>Click on a chat to start messaging the user</SheetTitle>
				</VisuallyHidden>
				<SheetTrigger className="mr-auto m-2 mb-0 cursor-pointer">
					<SidebarIcon />
				</SheetTrigger>
				<SheetContent side="left" className="w-fit">
					<ChatSidebarBase
						setSidebarIsOpen={setSidebarIsOpen}
						className="mt-2"
					/>
				</SheetContent>
			</Sheet>
		</div>
	);
}

export default function ChatSidebar() {
	return (
		<>
			<ChatSidebarSheet className="lg:hidden" />
			<ChatSidebarBase className="hidden lg:block" />
		</>
	);
}
