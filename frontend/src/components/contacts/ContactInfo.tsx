import { useState } from "react";
import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import {
	formatDate,
	isFriend,
	isIncomingRequest,
	isPendingRequest,
} from "../../../../shared/functions/utils.tsx";
import type {
	Contact,
	FriendRequestAction,
	User,
} from "../../../../shared/types.ts";
import {
	BuildingsIcon,
	CakeIcon,
	EarthIcon,
	EnvelopeIcon,
	PhoneIcon,
} from "../../assets/icons/icons.tsx";
import useFriendRequest from "../../hooks/api/useFriendRequest.ts";
import useUserStore from "../../state/useUserStore.ts";
import { cn } from "../../utils/utils.ts";
import IconButton, { type Icons } from "../ui/IconButton.tsx";

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
	const thisUser = useUserStore(useShallow((state) => state.user));
	if (!thisUser) return;

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
						{contact.about && (
							<div className="relative">
								<div className="flex justify-between">
									<h2 className="text-white font-bold mb-3">
										About {contact.firstName}
									</h2>
									<FriendStatusButtons
										contactId={contact._id}
										thisUser={thisUser}
									/>
								</div>
								<p className="text-muted max-w-sm">{contact.about}</p>
							</div>
						)}
						{contact.socials && Object.entries(contact.socials).length > 0 && (
							<div className="flex gap-3 mt-6">
								{Object.entries(contact.socials).map((link) => (
									<SocialLink key={link[0]} link={link} />
								))}
							</div>
						)}
						<div className="text-white">
							<h3 className="text-white font-bold mb-3 mt-6">Basic Info</h3>
							<div className="flex flex-wrap gap-30 w-full justify-start gap-y-10">
								{contact.birthday && (
									<div className="flex flex-col">
										<span>{basicInfoCards.birthday.icon}</span>
										<span className="text-sm mt-1 text-muted">
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
										<span className="text-sm mt-1 text-muted">
											{basicInfoCards.languages.title}
										</span>
										<span className="font-bold">
											{contact.languages.join(", ")}
										</span>
									</div>
								)}
								{contact.city && contact.country && (
									<div className="flex flex-col">
										<span>{basicInfoCards.city.icon}</span>
										<span className="text-sm mt-1 text-muted">
											{basicInfoCards.city.title}
										</span>
										<span className="font-bold">
											{contact.city}, {contact.country}
										</span>
									</div>
								)}
								{contact.phoneNumber && (
									<div className="flex flex-col">
										<span>{basicInfoCards.phoneNumber.icon}</span>
										<span className="text-sm mt-1 text-muted">
											{basicInfoCards.phoneNumber.title}
										</span>
										<span className="font-bold">{contact.phoneNumber}</span>
									</div>
								)}
								{contact.email && (
									<div className="flex flex-col">
										<span>{basicInfoCards.email.icon}</span>
										<span className="text-sm mt-1 text-muted">
											{basicInfoCards.email.title}
										</span>
										<span className="font-bold">{contact.email}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
				{activeTab === "mutualContacts" && (
					<div>
						{!contact.mutualFriends.length ? (
							<p className="text-muted font-bold">
								You and {contact.firstName} don't have any mutual contacts.
							</p>
						) : (
							<>
								<div className="flex gap-3 flex-wrap">
									{contact.mutualFriends.map((friend, index) => (
										<Link
											key={`${friend}-${index + 1}`}
											to={`/contacts/${friend._id}`}
											className="text-center border rounded-xl border-muted w-[168px] h-[178px] flex items-center flex-col justify-center"
										>
											<div className="rounded-full overflow-hidden h-[72px] aspect-square">
												<img src={friend.imageUrl} alt="" />
											</div>
											<div className="text-muted text-sm mt-3">
												@{friend.username}
											</div>
											<div className="text-white">
												<span>{friend.firstName}</span>{" "}
												<span>{friend.lastName}</span>
											</div>
										</Link>
									))}
								</div>
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
			<IconButton icon={platform as Icons} shape="rect" />
		</a>
	);
}

export function FriendStatusButtons({
	contactId,
	thisUser,
	className = "",
	shortAccept = false,
}: {
	contactId: User["_id"];
	thisUser: User;
	className?: string;
	shortAccept?: boolean;
}) {
	const { mutateAsync } = useFriendRequest();

	function BaseButton({
		text,
		action,
	}: { text: string; action: FriendRequestAction }) {
		return (
			<button
				type="button"
				onClick={async () =>
					await mutateAsync({
						receiverId: contactId,
						action,
					})
				}
				className={cn([
					"bg-message-primary px-3 py-1 rounded-[5px] cursor-pointer text-white",
					["cancel", "decline"].includes(action) && "bg-red-500",
					className,
				])}
			>
				{text}
			</button>
		);
	}

	if (isFriend(contactId, thisUser)) {
		return <BaseButton action={"unfriend"} text="Unfriend" />;
	}

	if (isPendingRequest(contactId, thisUser)) {
		return <BaseButton action={"cancel"} text="Cancel Request" />;
	}

	if (isIncomingRequest(contactId, thisUser)) {
		return (
			<div className="flex gap-3">
				<BaseButton
					action={"accept"}
					text={shortAccept ? "Accept" : "Accept Friend Request"}
				/>
				<BaseButton action={"decline"} text="Decline" />
			</div>
		);
	}

	return <BaseButton action={"send"} text="Add Friend" />;
}
