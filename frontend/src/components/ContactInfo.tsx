import { useState } from "react";
import formatDate from "../../../shared/functions/utils.ts";
import type { Contact } from "../../../shared/types.ts";
import {
	BuildingsIcon,
	CakeIcon,
	EarthIcon,
	EnvelopeIcon,
	PhoneIcon,
} from "../assets/icons/icons.tsx";
import { cn } from "../utils/utils.ts";
import IconButton from "./ui/IconButton.tsx";

type ContactInfoProps = {
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

export default function ContactInfo({ contact }: ContactInfoProps) {
	const [activeTab, setActiveTab] = useState<"about" | "mutualContacts">(
		"about",
	);

	return (
		<div className="mt-6 max-w-6xl mx-auto">
			<div className="text-sm text-muted flex gap-6 font-bold mb-2">
				<button
					className={cn([
						"cursor-pointer underline-offset-11",
						activeTab === "about" && "text-message-primary underline",
					])}
					type="button"
					onClick={() => setActiveTab("about")}
				>
					About
				</button>
				<button
					className={cn([
						"cursor-pointer underline-offset-11",
						activeTab === "mutualContacts" && "text-message-primary underline",
					])}
					type="button"
					onClick={() => setActiveTab("mutualContacts")}
				>
					Mutual Contacts
				</button>
			</div>
			<div className="p-6 bg-primary rounded-b-2xl">
				{activeTab === "about" && (
					<div>
						<div>
							<h2 className="text-white font-bold mb-3">
								About {contact.firstName}
							</h2>
							<p className="text-muted max-w-sm">{contact.about}</p>
						</div>
						<div className="flex gap-3 mt-6">
							{Object.entries(contact.socials).map((link) => (
								<SocialLink key={link[0]} link={link} />
							))}
						</div>
						<div className="text-white">
							<h3 className="text-white font-bold mb-3 mt-6">Basic Info</h3>
							<div className="flex flex-wrap gap-10 w-full justify-between">
								<div className="flex flex-col">
									<span>{basicInfoCards.birthday.icon}</span>
									<span className="text-sm mt-1 text-muted">
										{basicInfoCards.birthday.title}
									</span>
									<span className="font-bold">
										{formatDate(new Date(contact.birthday))}
									</span>
								</div>
								<div className="flex flex-col">
									<span>{basicInfoCards.languages.icon}</span>
									<span className="text-sm mt-1 text-muted">
										{basicInfoCards.languages.title}
									</span>
									<span className="font-bold">
										{contact.languages.join(", ")}
									</span>
								</div>
								<div className="flex flex-col">
									<span>{basicInfoCards.city.icon}</span>
									<span className="text-sm mt-1 text-muted">
										{basicInfoCards.city.title}
									</span>
									<span className="font-bold">
										{contact.city}, {contact.country}
									</span>
								</div>
								<div className="flex flex-col">
									<span>{basicInfoCards.phoneNumber.icon}</span>
									<span className="text-sm mt-1 text-muted">
										{basicInfoCards.phoneNumber.title}
									</span>
									<span className="font-bold">{contact.phoneNumber}</span>
								</div>
								<div className="flex flex-col">
									<span>{basicInfoCards.email.icon}</span>
									<span className="text-sm mt-1 text-muted">
										{basicInfoCards.email.title}
									</span>
									<span className="font-bold">{contact.email}</span>
								</div>
							</div>
						</div>
					</div>
				)}
				{/*TODO: mutual contacts*/}
				{activeTab === "mutualContacts" && (
					<div>
						{!contact.mutualFriends.length ? (
							<p className="text-muted font-bold">
								You and {contact.firstName} don't have any mutual contacts.
							</p>
						) : (
							<>
								<h3>Mutual Contacts</h3>
								{contact.mutualFriends.map((friend, index) => (
									<div key={`${friend}-${index + 1}`}>{friend}</div>
								))}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

function SocialLink({ link }: { link: [string, string] }) {
	const [platform, url] = link;

	return (
		<a href={url} target="_blank" rel="noopener noreferrer">
			<IconButton icon={platform} shape="rect" />
		</a>
	);
}
