import { cn } from "@/utils/utils.ts";
import {
	AttachmentIcon,
	BellIcon,
	CheckmarkIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	CloseIcon,
	ContactIcon,
	EditIcon,
	EllipsisIcon,
	EmojiIcon,
	EnvelopeIcon,
	FacebookIcon,
	FilterIcon,
	ImageIcon,
	InstagramIcon,
	LogoIcon,
	MessageIcon,
	NotificationIcon,
	PlusIcon,
	ProfileIcon,
	SearchIcon,
	SendIcon,
	SidebarIcon,
	TiktokIcon,
	TrashIcon,
	XIcon,
} from "../../assets/icons/icons.tsx";

export type Icons =
	| "logo"
	| "message"
	| "contact"
	| "search"
	| "sidebar"
	| "chevron-up"
	| "chevron-down"
	| "close"
	| "notification"
	| "plus"
	| "filter"
	| "ellipsis"
	| "checkmark"
	| "bell"
	| "profile"
	| "trash"
	| "image"
	| "emoji"
	| "facebook"
	| "x"
	| "instagram"
	| "tiktok"
	| "envelope"
	| "send"
	| "edit"
	| "attachment";

const icons = {
	logo: <LogoIcon />,
	message: <MessageIcon />,
	contact: <ContactIcon />,
	search: <SearchIcon />,
	sidebar: <SidebarIcon />,
	"chevron-up": <ChevronUpIcon />,
	"chevron-down": <ChevronDownIcon />,
	close: <CloseIcon />,
	notification: <NotificationIcon />,
	plus: <PlusIcon />,
	filter: <FilterIcon />,
	ellipsis: <EllipsisIcon />,
	checkmark: <CheckmarkIcon />,
	bell: <BellIcon />,
	profile: <ProfileIcon />,
	trash: <TrashIcon />,
	image: <ImageIcon />,
	emoji: <EmojiIcon />,
	facebook: <FacebookIcon />,
	x: <XIcon />,
	instagram: <InstagramIcon />,
	tiktok: <TiktokIcon />,
	envelope: <EnvelopeIcon />,
	send: <SendIcon />,
	edit: <EditIcon />,
	attachment: <AttachmentIcon />,
};

type IconButtonProps = {
	icon: Icons;
	className?: string;
	onClick?: () => void;
	href?: string;
	shape?: "round" | "rect";
	isActive?: boolean;
};

export default function IconButton({
	icon,
	className = "",
	onClick,
	shape = "round",
	isActive = false,
}: IconButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn([
				"cursor-pointer transition-all grid place-items-center bg-background h-12 rounded-full aspect-square p-3.5 [&_svg]:fill-primary [&_svg]:h-full [&_svg]:w-full border-1 border-muted-foreground",
				shape === "rect" && "rounded-md",
				className,
				isActive && ["[&_svg]:fill-secondary bg-foreground"],
			])}
		>
			{icons[icon]}
		</button>
	);
}
