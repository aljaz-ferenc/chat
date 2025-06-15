import { UserButton } from "@clerk/clerk-react";
import { useMemo } from "react";
import { NavLink, useResolvedPath } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { Routes } from "../../../shared/Routes.enum.ts";
import { LogoIcon } from "../assets/icons/icons";
import useReadNotification from "../hooks/api/useReadNotification.ts";
import useUser from "../hooks/api/useUser.ts";
import useUserStore from "../state/useUserStore.ts";
import { cn } from "../utils/utils.ts";
import IconButton from "./ui/IconButton.tsx";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "./ui/DropdownMenu.tsx";
import type {Notification} from "../../../shared/types.ts";
import UserCard from "./UserCard.tsx";
import {FriendStatusButtons} from "./contacts/ContactInfo.tsx";
import useDeleteNotifications from "../hooks/api/useDeleteNotifications.ts";

export default function Header() {
	const { mutateAsync: readNotification } = useReadNotification();
	const {mutateAsync: deleteNotifications} = useDeleteNotifications()
	const { refetch } = useUser();
	const [notifications, opened] = useUserStore(
		useShallow((state) => [
			state.user?.notifications,
			state.user?.notifications?.opened,
		]),
	);
	// @ts-ignore
	const { pathname } = useResolvedPath();

	const existsUnread = useMemo(() => {
		return notifications?.notifications.some((n) => !n.read);
	}, [notifications]);

	return (
		<header className="h-full bg-primary w-full flex items-center border-b border-border">
			<div className="h-full px-6.5 border-r border-border grid place-items-center w-24">
				<LogoIcon />
			</div>
			<div className="flex px-4 gap-4 w-full">
				<NavLink to={Routes.CHATS}>
					<IconButton
						isActive={pathname.startsWith(`/${Routes.CHATS}`)}
						icon="message"
					/>
				</NavLink>
				<NavLink to={Routes.CONTACTS}>
					<IconButton
						isActive={pathname.startsWith(`/${Routes.CONTACTS}`)}
						icon="contact"
					/>
				</NavLink>
				<DropdownMenu onOpenChange={ async(open) => {
					if(open) {
						await readNotification().then(() => refetch())
					}
				}}>
					<DropdownMenuTrigger className='ml-auto'>
				<IconButton
					icon="notification"
					className={cn([
						existsUnread && !opened && "[&_#dot]:fill-red-500",
					])}
				/>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='bg-primary border-muted text-white min-w-sm mr-6 p-2'>

						{notifications?.notifications.length === 0 && (
							<DropdownMenuItem>
								<div>No notifications</div>
							</DropdownMenuItem>
						)}

						{notifications?.notifications.length!! > 0 && (
							<DropdownMenuItem className='text-muted text-sm underline'>
								<button onClick={async () => deleteNotifications()} className='cursor-pointer'>Clear all</button>
							</DropdownMenuItem>
						)}

						{notifications?.notifications.length!! > 0 &&
							notifications?.notifications.map((n) => (
								<DropdownMenuItem key={n._id}>
									<Notification notification={n} />
								</DropdownMenuItem>
							))}

					</DropdownMenuContent>
				</DropdownMenu>


				<UserButton />
			</div>
		</header>
	);
}

type NotificationProps = {
	notification: Pick<Notification, '_id' | 'type' | 'from'>
}

function Notification({notification}: NotificationProps){
	const thisUser = useUserStore(useShallow(state => state.user))

	if(!thisUser) return

	if(notification.type === 'friendRequest'){
	return <div className='flex items-center gap-1'>
		<UserCard user={notification.from} showUsername={false}/>
		<span className='mr-1'>
		sent you a friend request.
		</span>
		<FriendStatusButtons contactId={notification.from._id} thisUser={thisUser} shortAccept/>
	</div>
	}
}