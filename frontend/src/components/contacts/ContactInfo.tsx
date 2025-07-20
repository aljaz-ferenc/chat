import About from "@/components/contacts/About.tsx";
import MutualFriends from "@/components/contacts/MutualFriends.tsx";
import { cn } from "@/utils/utils.ts";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Contact } from "../../../../shared/types.ts";
import useUserStore from "../../state/useUserStore.ts";

type ContactInfoProps = {
	contact: Contact;
};

export default function ContactInfo({ contact }: ContactInfoProps) {
	const [activeTab, setActiveTab] = useState<"about" | "mutualContacts">(
		"about",
	);
	const thisUser = useUserStore(useShallow((state) => state.user));
	if (!thisUser) return;

	return (
		<div className="mt-6 max-w-6xl mx-auto">
			<div className="text-sm text-muted-foreground flex gap-6 font-bold mb-2">
				<button
					className={cn([
						"cursor-pointer underline-offset-11",
						activeTab === "about" && "text-primary underline",
					])}
					type="button"
					onClick={() => setActiveTab("about")}
				>
					About
				</button>
				<button
					className={cn([
						"cursor-pointer underline-offset-11",
						activeTab === "mutualContacts" && "text-primary underline",
					])}
					type="button"
					onClick={() => setActiveTab("mutualContacts")}
				>
					Mutual Contacts
				</button>
			</div>
			<div className="p-6 bg-card rounded-b-2xl text-primary">
				{activeTab === "about" && <About contact={contact} />}
				{activeTab === "mutualContacts" && <MutualFriends contact={contact} />}
			</div>
		</div>
	);
}
