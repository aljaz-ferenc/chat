import FriendStatusButtons from "@/components/FriendStatusButtons.tsx";
import { useTheme } from "@/providers/ThemeProvider.tsx";
import { UserButton } from "@clerk/clerk-react";
import { MoonIcon, SunIcon, UserIcon } from "lucide-react";
import { useMemo } from "react";
import { NavLink, useNavigate, useResolvedPath } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { Routes } from "../../../shared/Routes.enum.ts";
import type { Notification as TNotification } from "../../../shared/types.ts";
import useDeleteNotifications from "../hooks/api/useDeleteNotifications.ts";
import useReadNotification from "../hooks/api/useReadNotification.ts";
import useUser from "../hooks/api/useUser.ts";
import useUserStore from "../state/useUserStore.ts";
import { cn } from "../utils/utils.ts";
import UserCard from "./UserCard.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/DropdownMenu.tsx";
import IconButton from "./ui/IconButton.tsx";

export default function Header() {
	const { mutateAsync: readNotification } = useReadNotification();
	const { mutateAsync: deleteNotifications } = useDeleteNotifications();
	const { refetch, data: user } = useUser();
	const [notifications, opened] = useUserStore(
		useShallow((state) => [
			state.user?.notifications,
			state.user?.notifications?.opened,
			state.user?.imageUrl,
		]),
	);
	const { pathname } = useResolvedPath({});
	const navigate = useNavigate();

	const existsUnread = useMemo(() => {
		return notifications?.notifications.some((n) => !n.read);
	}, [notifications]);
	const { setTheme, theme } = useTheme();

	return (
		<header className="h-full bg-background w-full flex items-center border-b border-border">
			{/*<div className="h-full px-6.5 border-r border-border grid place-items-center w-24">*/}
			{/*	<LogoIcon />*/}
			{/*</div>*/}
			<div className="flex px-6 gap-4 w-full">
				<NavLink
					to={`/${Routes.CHATS}`}
					className="flex flex-col justify-between items-center gap-1"
				>
					<IconButton
						isActive={pathname.startsWith(`/${Routes.CHATS}`)}
						icon="message"
					/>
					<span className="text-xs text-primary text-center hidden md:block">
						Messages
					</span>
				</NavLink>
				<NavLink
					to={`/${Routes.CONTACTS}`}
					className="flex flex-col justify-between items-center"
				>
					<IconButton
						isActive={pathname.startsWith(`/${Routes.CONTACTS}`)}
						icon="contact"
					/>
					<span className="text-xs text-primary text-center hidden md:block">
						Contacts
					</span>
				</NavLink>
				<DropdownMenu
					onOpenChange={async (open) => {
						if (open) {
							await readNotification().then(() => refetch());
						}
					}}
				>
					<DropdownMenuTrigger className="ml-auto flex flex-col justify-between items-center cursor-pointer">
						<IconButton
							icon="notification"
							className={cn([
								"[&_#dot]:fill-muted-foreground",
								existsUnread && !opened && "[&_#dot]:fill-red-500",
							])}
						/>
						<span className="text-xs text-primary text-center hidden md:block">
							Notifications
						</span>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="bg-background border-muted mr-6 p-2 text-primary">
						{notifications?.notifications.length === 0 && (
							<DropdownMenuItem>
								<div>No notifications</div>
							</DropdownMenuItem>
						)}

						{!!notifications?.notifications.length &&
							notifications?.notifications.length > 0 && (
								<DropdownMenuItem className="text-muted-foreground hover:text-primary text-sm hover:underline transition">
									<button
										type="button"
										onClick={async () => deleteNotifications()}
										className="cursor-pointer"
									>
										Clear all
									</button>
								</DropdownMenuItem>
							)}

						{!!notifications?.notifications.length &&
							notifications?.notifications.length > 0 &&
							notifications?.notifications.map((n) => (
								<DropdownMenuItem key={n._id}>
									<Notification notification={n} />
								</DropdownMenuItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
				<div className="flex flex-col justify-between items-center">
					<UserButton>
						<UserButton.MenuItems>
							<UserButton.Action
								onClick={() => navigate(`/${Routes.PROFILE}`)}
								label="Profile"
								labelIcon={<UserIcon size={17} />}
							/>
							<UserButton.Action
								onClick={() => {
									setTheme(theme === "light" ? "dark" : "light");
								}}
								label={`${theme === "light" ? "Dark" : "Light"} Mode`}
								labelIcon={
									theme === "light" ? (
										<MoonIcon size={17} />
									) : (
										<SunIcon size={17} />
									)
								}
							/>
						</UserButton.MenuItems>
					</UserButton>
					<span className="text-xs text-primary text-center hidden md:block">
						{user?.firstName} {user?.lastName}
					</span>
				</div>
			</div>
		</header>
	);
}

type NotificationProps = {
	notification: Pick<TNotification, "_id" | "type" | "from" | "chatId">;
};

function Notification({ notification }: NotificationProps) {
	const thisUser = useUserStore(useShallow((state) => state.user));
	const navigate = useNavigate();

	if (!thisUser) return;

	if (notification.type === "friendRequest") {
		return (
			<div className="flex items-center gap-1">
				<UserCard user={notification.from} showUsername={false} />
				<span className="mr-1">sent you a friend request.</span>
				<FriendStatusButtons
					contactId={notification.from._id}
					thisUser={thisUser}
					shortAccept
				/>
			</div>
		);
	}

	if (notification.type === "addedToGroup") {
		return (
			<button
				type="button"
				onClick={() => navigate(`/chats/${notification.chatId}`)}
				className="flex items-center gap-1 cursor-pointer"
			>
				<UserCard user={notification.from} showUsername={false} />
				<span className="-ml-1">added you to group.</span>
			</button>
		);
	}
}
