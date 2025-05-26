import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router";
import { LogoIcon } from "../assets/icons/icons";
import IconButton from "./ui/IconButton.tsx";

export default function Header() {
	return (
		<header className="h-full bg-primary w-full flex items-center border-b border-border">
			<div className="h-full px-6.5 border-r border-border grid place-items-center w-24">
				<LogoIcon />
			</div>
			<div className="flex px-4 gap-4 w-full">
				<Link to="/chat">
					<IconButton icon="message" />
				</Link>
				<Link to={"/contacts"}>
					<IconButton icon="contact" />
				</Link>
				<IconButton icon="notification" className="ml-auto" />
				<UserButton />
			</div>
		</header>
	);
}
