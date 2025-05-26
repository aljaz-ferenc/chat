import {
	BellIcon,
	CheckmarkIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	CloseIcon,
	ContactIcon,
	EllipsisIcon,
	EmojiIcon,
	FilterIcon,
	ImageIcon,
	LogoIcon,
	MessageIcon,
	NotificationIcon,
	PlusIcon,
	ProfileIcon,
	SearchIcon,
	SidebarIcon,
	TrashIcon,
} from "../../assets/icons/icons.tsx";
import { cn } from "../../utils/utils.ts";

type Icons =
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
	| "emoji";

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
};

type IconButtonProps = {
	icon: Icons;
	className?: string;
	onClick?: () => void;
};

export default function IconButton({
	icon,
	className = "",
	onClick,
}: IconButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn([
				"cursor-pointer transition-all grid place-items-center bg-icon-background hover:bg-icon-background-active h-12 rounded-full aspect-square p-3.5 [&_svg]:fill-icon hover:[&_svg]:fill-icon-active [&_svg]:h-full [&_svg]:w-full",
				className,
			])}
		>
			{icons[icon]}
		</button>
	);
}
