import ContactsSidebar from "@/components/contacts/ContactsSidebar.tsx";
import { Outlet } from "react-router";

export default function ContactsLayout() {
	return (
		<div className="flex flex-col relative lg:flex-row h-[calc(100vh-65px)] md:h-[calc(100vh-90px)]">
			<ContactsSidebar />
			<Outlet />
		</div>
	);
}
