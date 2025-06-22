import {
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
import { cn } from "../../utils/utils.ts";

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
	| "edit";

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
				"cursor-pointer transition-all grid place-items-center bg-icon-background hover:bg-icon-background-active h-12 rounded-full aspect-square p-3.5 [&_svg]:fill-icon hover:[&_svg]:fill-icon-active [&_svg]:h-full [&_svg]:w-full",
				shape === "rect" && "rounded-md",
				className,
				isActive && ["bg-icon-background-active [&_svg]:fill-icon-active"],
			])}
		>
			{icons[icon]}
		</button>
	);
}
