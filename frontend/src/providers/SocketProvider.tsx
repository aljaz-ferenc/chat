import { type PropsWithChildren, useEffect } from "react";
import { io } from "socket.io-client";
import { useShallow } from "zustand/react/shallow";
import useUser from "../hooks/api/useUser.ts";
import useUserStore from "../state/useUserStore.ts";
// @ts-ignore
const socket = io(import.meta.env.VITE_BACKEND_URL, { autoConnect: false });

export default function SocketProvider({ children }: PropsWithChildren) {
	const userId = useUserStore(useShallow((state) => state.user?._id));
	const { refetch } = useUser();

	useEffect(() => {
		if (!userId) return;
		socket.connect();

		socket.on("connect", () => {
			socket.emit("online", userId);
		});

		//TODO: use same event for each if they do the same thing, but wait for confirmation
		socket.on("friendRequest-incoming", async () => {
			await refetch();
		});

		socket.on("notification-new", async () => {
			await refetch();
		});

		socket.on("friendRequest-declined", async () => {
			await refetch();
		});

		socket.on("friendRequest-accepted", async () => {
			await refetch();
		});

		socket.on("friendRequest-canceled", async () => {
			await refetch();
		});

		socket.on("friendRequest-unfriended", async () => {
			await refetch();
		})

		return () => {
			socket.off("connect");
			socket.disconnect();
		};
	}, [userId, refetch]);

	return <>{children}</>;
}
