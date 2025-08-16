import { Link } from "react-router";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-screen gap-3">
			<h1 className="text-8xl">404</h1>
			<p className="text-3xl">This page doesn't exist</p>
			<p className="flex gap-1">
				<span>Go back to</span>
				<Link className="underline text-muted-foreground" to="/chats">
					Chat
				</Link>
			</p>
		</div>
	);
}
