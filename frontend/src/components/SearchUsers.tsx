import { useShallow } from "zustand/react/shallow";
import useAllUsers from "../hooks/api/useAllUsers.ts";
import useFriendRequest from "../hooks/api/useFriendRequest.ts";
import useUserStore from "../state/useUserStore.ts";
import UserCard, { UserCardSkeleton } from "./UserCard.tsx";

export default function SearchUsers() {
	const { data: users } = useAllUsers();
	const [thisUser] = useUserStore(useShallow((state) => [state.user]));
	const { mutateAsync: sendRequest, isPending } = useFriendRequest();

	const isFriend = (userId: string) => {
		return thisUser?.friends.friends.some((u) => u._id === userId);
	};

	const isPendingRequest = (userId: string) => {
		return thisUser?.friends.pendingRequests.some((u) => u._id === userId);
	};

	const isBlocked = (userId: string) => {
		return thisUser?.friends.blocked.some((u) => u._id === userId);
	};

	const isIncomingRequest = (userId: string) => {
		return thisUser?.friends.incomingRequests.some((u) => u._id === userId);
	};

	return (
		<div className="p-6 max-w-6xl w-full mx-auto">
			<div>
				<input
					type="text"
					placeholder="Search users..."
					className={
						"w-full p-2 outline-border outline rounded-[5px] focus-visible:outline-none focus-visible:bg-background text-muted"
					}
				/>
			</div>
			<div className="flex flex-col gap-4 mt-6">
				{users ? (
					users.map((user) => {
						if (
							user._id === thisUser?._id ||
							isPendingRequest(user._id) ||
							isBlocked(user._id) ||
							isIncomingRequest(user._id)
						)
							return null;

						if (isFriend(user._id)) {
							return (
								<div
									key={user._id}
									className="flex justify-between items-center text-muted font-bold"
								>
									<UserCard user={user} />
									<span>Friends</span>
								</div>
							);
						}

						return (
							<div key={user._id} className="flex justify-between items-center">
								<UserCard user={user} />
								<button
									type="button"
									disabled={isPending}
									onClick={async () =>
										await sendRequest({
											receiverId: user._id,
											action: "send",
										})
									}
									className="cursor-pointer text-white bg-message-primary px-3 py-1 h-min rounded-[5px] ml-auto"
								>
									Add
								</button>
								)
							</div>
						);
					})
				) : (
					<div className="flex flex-col gap-4">
						{Array(10)
							.fill(0)
							.map((_, i) => (
								<UserCardSkeleton key={`skeleton-${i + 1}`} />
							))}
					</div>
				)}
			</div>

			{/*PENDING REQUESTS*/}
			{!!thisUser?.friends.pendingRequests.length && (
				<div className="flex flex-col gap-4 mt-10">
					<h3 className="text-muted text-sm font-bold">Pending Requests</h3>
					{thisUser?.friends.pendingRequests.map((user) => (
						<div key={user._id} className="flex justify-between items-center">
							<UserCard user={user} />
							<button
								type="button"
								onClick={async () => {
									sendRequest({ receiverId: user._id, action: "cancel" });
								}}
								className="cursor-pointer text-white bg-red-500 px-3 py-1 h-min rounded-[5px]"
							>
								Cancel
							</button>
						</div>
					))}{" "}
				</div>
			)}

			{/*INCOMING REQUESTS*/}
			{!!thisUser?.friends.incomingRequests.length && (
				<div className="flex flex-col gap-4 mt-10">
					<h3 className="text-muted text-sm font-bold">Incoming Requests</h3>
					{thisUser?.friends.incomingRequests.map((user) => (
						<div key={user._id} className="flex justify-between items-center">
							<UserCard user={user} />
							<button
								type="button"
								onClick={async () => {
									sendRequest({ receiverId: user._id, action: "accept" });
								}}
								className="ml-auto mr-2 cursor-pointer text-white bg-message-primary px-3 py-1 h-min rounded-[5px]"
							>
								Accept
							</button>
							<button
								type="button"
								onClick={async () => {
									sendRequest({ receiverId: user._id, action: "decline" });
								}}
								className="cursor-pointer text-white bg-red-500 px-3 py-1 h-min rounded-[5px]"
							>
								Decline
							</button>
						</div>
					))}{" "}
				</div>
			)}
		</div>
	);
}
