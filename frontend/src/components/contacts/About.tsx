import {
	BuildingsIcon,
	CakeIcon,
	EarthIcon,
	EnvelopeIcon,
	PhoneIcon,
} from "@/assets/icons/icons.tsx";
import FriendStatusButtons from "@/components/FriendStatusButtons.tsx";
import IconButton, { type Icons } from "@/components/ui/IconButton.tsx";
import useUserStore from "@/state/useUserStore.ts";
import { useShallow } from "zustand/react/shallow";
import { formatDate } from "../../../../shared/functions/utils.tsx";
import type { Contact } from "../../../../shared/types.ts";

type AboutProps = {
	contact: Contact;
};

const basicInfoCards = {
	birthday: {
		icon: <CakeIcon />,
		title: "Birth day",
	},
	languages: {
		icon: <EarthIcon />,
		title: "Languages",
	},
	city: {
		icon: <BuildingsIcon />,
		title: "City",
	},
	phoneNumber: {
		icon: <PhoneIcon />,
		title: "Phone No",
	},
	email: {
		icon: <EnvelopeIcon />,
		title: "Email",
	},
};

export default function About({ contact }: AboutProps) {
	const thisUser = useUserStore(useShallow((state) => state.user));
	if (!thisUser) return;

	return (
		<div>
			{contact.about && (
				<div className="relative">
					<div className="flex justify-between items-center">
						<h2 className=" font-bold mb-3">About {contact.firstName}</h2>
						<FriendStatusButtons contactId={contact._id} thisUser={thisUser} />
					</div>
					<p className=" max-w-sm">{contact.about}</p>
				</div>
			)}
			{contact.socials && Object.entries(contact.socials).length > 0 && (
				<div className="flex gap-3 mt-6">
					{Object.entries(contact.socials).map(([social, value]) => {
						if (!value) return null;
						return <SocialLink key={social} link={[social, value]} />;
					})}
				</div>
			)}
			<div className="">
				<h3 className=" font-bold mb-3 mt-6">Basic Info</h3>
				<div className="flex flex-wrap gap-30 w-full justify-start gap-y-10">
					{contact.birthday && (
						<div className="flex flex-col">
							<span>{basicInfoCards.birthday.icon}</span>
							<span className="text-sm mt-1 ">
								{basicInfoCards.birthday.title}
							</span>
							<span className="font-bold">
								{formatDate(new Date(contact.birthday))}
							</span>
						</div>
					)}
					{!!contact.languages?.length && (
						<div className="flex flex-col">
							<span>{basicInfoCards.languages.icon}</span>
							<span className="text-sm mt-1 ">
								{basicInfoCards.languages.title}
							</span>
							<span className="font-bold">{contact.languages.join(", ")}</span>
						</div>
					)}
					{contact.city && contact.country && (
						<div className="flex flex-col">
							<span>{basicInfoCards.city.icon}</span>
							<span className="text-sm mt-1 ">{basicInfoCards.city.title}</span>
							<span className="font-bold">
								{contact.city}, {contact.country}
							</span>
						</div>
					)}
					{contact.phoneNumber && (
						<div className="flex flex-col">
							<span>{basicInfoCards.phoneNumber.icon}</span>
							<span className="text-sm mt-1 ">
								{basicInfoCards.phoneNumber.title}
							</span>
							<span className="font-bold">{contact.phoneNumber}</span>
						</div>
					)}
					{contact.email && (
						<div className="flex flex-col">
							<span>{basicInfoCards.email.icon}</span>
							<span className="text-sm mt-1 ">
								{basicInfoCards.email.title}
							</span>
							<span className="font-bold">{contact.email}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function SocialLink({ link }: { link: [string, string] }) {
	const [platform, url] = link;

	return (
		<a href={url} target="_blank" rel="noopener noreferrer">
			<IconButton icon={platform as Icons} shape="rect" />
		</a>
	);
}
