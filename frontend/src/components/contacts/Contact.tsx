import { useParams } from "react-router";
import type { User } from "../../../../shared/types.ts";
import useContact from "../../hooks/api/useContact.ts";
import Spinner from "../ui/Spinner.tsx";
import ContactInfo from "./ContactInfo.tsx";
import { ProfileHeader } from "./ProfileHeader.tsx";

export default function Contact() {
	const { contactId } = useParams();
	const {
		data: contact,
		isPending,
		error,
	} = useContact(contactId as User["_id"]);
	console.log("CONTACT: ", contact);

	if (isPending) {
		return (
			<div className="h-full w-full">
				<Spinner />
			</div>
		);
	}

	if (error || !contact) {
		return (
			<div className="text-muted font-bold text-center mt-20">
				This user doesn't exist.
			</div>
		);
	}

	return (
		<div className="bg-background h-full w-full p-6">
			<ProfileHeader user={contact} />
			<ContactInfo contact={contact} />
		</div>
	);
}
