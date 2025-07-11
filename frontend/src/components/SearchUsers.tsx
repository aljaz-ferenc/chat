import { useDebounce } from "@uidotdev/usehooks";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import {
	isBlocked,
	isFriend,
	isIncomingRequest,
	isPendingRequest,
} from "../../../shared/functions/utils.tsx";
import type { Chat } from "../../../shared/types.ts";
import useFriendRequest from "../hooks/api/useFriendRequest.ts";
import useSearchUsers from "../hooks/api/useSearchUsers.ts";
import useUserStore from "../state/useUserStore.ts";
import UserCard from "./UserCard.tsx";
import { FriendStatusButtons } from "./contacts/ContactInfo.tsx";
import IconButton from "./ui/IconButton.tsx";

export default function SearchUsers() {
	const [thisUser] = useUserStore(useShallow((state) => [state.user]));
	useFriendRequest();
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);
	const navigate = useNavigate();

	const { data: users, isPending: isSearchPending } =
		useSearchUsers(debouncedQuery);

	if (!thisUser) return;

	return (
		<div className="p-6 max-w-6xl w-full mx-auto">
			<div className="relative">
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					type="text"
					placeholder="Search all users by name or username..."
					className={
						"w-full p-2 outline-border outline rounded-[5px] focus-visible:outline-none focus-visible:bg-background text-muted"
					}
				/>
				{query && (
					<button
						type="button"
						onClick={() => setQuery("")}
						className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
					>
						<X color="var(--muted)" size={20} />
					</button>
				)}
			</div>
			<div className="flex flex-col gap-4 mt-6">
				{!isSearchPending &&
					users &&
					users.map((user) => {
						if (
							user._id === thisUser?._id ||
							isPendingRequest(user._id, thisUser) ||
							isBlocked(user._id, thisUser) ||
							isIncomingRequest(user._id, thisUser)
						)
							return null;

						if (isFriend(user._id, thisUser)) {
							return (
								<div
									key={user._id}
									className="flex justify-between items-center text-muted font-bold"
								>
									<UserCard highlight={query} user={user} />
									<IconButton
										onClick={() =>
											navigate(
												`/chats/${
													(
														thisUser.chats.find(
															(chat) =>
																(chat as Chat).type === "single" &&
																(user.chats as string[]).includes(
																	(chat as Chat)._id,
																),
														) as Chat
													)?._id
												}`,
											)
										}
										icon="message"
									/>
									{/*<span>Friends</span>*/}
								</div>
							);
						}

						return (
							<div key={user._id} className="flex justify-between items-center">
								<UserCard highlight={query} user={user} />
								<FriendStatusButtons thisUser={thisUser} contactId={user._id} />
							</div>
						);
					})}
			</div>

			{/*PENDING REQUESTS*/}
			{!!thisUser?.friends.pendingRequests.length && (
				<div className="flex flex-col gap-4 mt-10">
					<h3 className="text-muted text-sm font-bold">Pending Requests</h3>
					{thisUser?.friends.pendingRequests.map((user) => (
						<div key={user._id} className="flex justify-between items-center">
							<UserCard user={user} />
							<FriendStatusButtons contactId={user._id} thisUser={thisUser} />
						</div>
					))}
				</div>
			)}

			{/*INCOMING REQUESTS*/}
			{!!thisUser?.friends.incomingRequests.length && (
				<div className="flex flex-col gap-4 mt-10">
					<h3 className="text-muted text-sm font-bold">Incoming Requests</h3>
					{thisUser?.friends.incomingRequests.map((user) => (
						<div key={user._id} className="flex justify-between items-center">
							<UserCard user={user} />
							<FriendStatusButtons contactId={user._id} thisUser={thisUser} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}
