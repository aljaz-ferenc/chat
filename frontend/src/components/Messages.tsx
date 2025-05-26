import { useParams } from "react-router";
import { fakeUsers } from "../layouts/ChatLayout.tsx";
import UserCard from "./UserCard.tsx";

export default function Messages() {
	const { id } = useParams();
	const user = fakeUsers.find((user) => user.id === id);

	return (
		<>
			<div className="h-[96px] bg-primary border-b border-border p-6">
				{user && <UserCard user={user} bottomText="Active" />}
			</div>
			<div className="h-full p-6 bg-background overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
				{null}
			</div>
		</>
	);
}
