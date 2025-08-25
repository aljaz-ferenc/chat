import { create } from "zustand/react";
import type { Notification } from "../../../shared/types.ts";

type NotificationsStore = {
	notifications: Notification[];
	newMessageArrived: boolean;
	setNotifications: (notifications: Notification[]) => void;
	setNewMessageArrived: (hasArrived: boolean) => void;
};

const useNotificationsStore = create<NotificationsStore>((set) => ({
	notifications: [],
	newMessageArrived: false,
	setNotifications: (notifications) => set({ notifications }),
	setNewMessageArrived: (hasArrived) => set({ newMessageArrived: hasArrived }),
}));

export default useNotificationsStore;
