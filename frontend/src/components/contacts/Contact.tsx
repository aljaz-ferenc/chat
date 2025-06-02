import { useParams } from "react-router";
import type { User } from "../../../../shared/types.ts";
import useContact from "../../hooks/api/useContact.ts";
import ContactInfo from "./ContactInfo.tsx";

export default function Contact() {
	const { contactId } = useParams();
	const { data: contact, isPending } = useContact(contactId as User["_id"]);

	if (isPending) {
		return <div>Loading contact</div>;
	}

	return (
		<div className="bg-background h-full w-full p-6 ">
			<div className="bg-primary rounded-2xl overflow-hidden max-w-6xl mx-auto">
				{/*BACKGROUND IMAGE*/}
				<div className="w-full h-[500px] relative  overflow-hidden">
					<img
						className="absolute inset-0 object-cover w-full h-full object-center"
						src="https://picsum.photos/300/200"
						alt=""
					/>
				</div>
				<div className="px-8 ">
					{/*PROFILE PIC*/}
					<div className="flex gap-5 text-white">
						<div className="relative h-[150px] w-[150px] border-border border-2 rounded-xl overflow-hidden -translate-y-8">
							<img src="https://picsum.photos/300" alt="" />
						</div>
						<div className="mt-6">
							<h3>
								<span className="font-bold text-lg">
									{contact.firstName} {contact.lastName}
								</span>{" "}
								<span className="text-sm text-muted">@{contact.username}</span>
							</h3>
							<div>
								<span className="text-sm text-muted">
									{contact.friends.friends.length} Contacts
								</span>
								<span className="text-xs text-muted">
									{" "}
									&bull; {contact?.mutualFriends.length} Mutual
								</span>
							</div>
							{/*TODO: mutual contacts*/}
						</div>
					</div>
				</div>
			</div>
			<ContactInfo contact={contact} />
		</div>
	);
}
