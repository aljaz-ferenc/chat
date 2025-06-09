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

export default function Header() {
	const { mutateAsync: readNotification } = useReadNotification();
	const { refetch } = useUser();
	const [notifications, opened] = useUserStore(
		useShallow((state) => [
			state.user?.notifications,
			state.user?.notifications?.opened,
		]),
	);
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

				<IconButton
					onClick={async () => await readNotification().then(() => refetch())}
					icon="notification"
					className={cn([
						"ml-auto",
						existsUnread && !opened && "[&_#dot]:fill-red-500",
					])}
				/>

				<UserButton />
			</div>
		</header>
	);
}
