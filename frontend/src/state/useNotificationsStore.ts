import { create } from "zustand/react";
import type { Notification } from "../../../shared/types.ts";

type NotificationsStore = {
	notifications: Notification[];
	setNotifications: (notifications: Notification[]) => void;
};

const useNotificationsStore = create<NotificationsStore>((set) => ({
	notifications: [],
	setNotifications: (notifications) => set({ notifications }),
}));

export default useNotificationsStore;
