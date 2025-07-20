import { Link } from "react-router";
import type { Contact } from "../../../../shared/types.ts";

type MutualFriendsProps = {
	contact: Contact;
};

export default function MutualFriends({ contact }: MutualFriendsProps) {
	return (
		<div>
			{!contact.mutualFriends.length ? (
				<p className="font-bold">
					You and {contact.firstName} don't have any mutual contacts.
				</p>
			) : (
				<>
					<div className="flex gap-3 flex-wrap">
						{contact.mutualFriends.map((friend, index) => (
							<Link
								key={`${friend}-${index + 1}`}
								to={`/contacts/${friend._id}`}
								className="p-3 text-center border rounded-xl border-muted/30 w-[158px] h-[178px] flex items-center flex-col justify-center hover:bg-background hover:border-muted transition"
							>
								<div className="rounded-full overflow-hidden h-full aspect-square relative">
									<img
										src={friend.imageUrl}
										alt=""
										className="absolute inset-0 w-full h-full object-cover"
									/>
								</div>
								<div className=" text-sm mt-3">@{friend.username}</div>
								<div className="">
									<span>{friend.firstName}</span> <span>{friend.lastName}</span>
								</div>
							</Link>
						))}
					</div>
				</>
			)}
		</div>
	);
}
