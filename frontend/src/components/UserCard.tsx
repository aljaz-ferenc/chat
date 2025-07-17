import { Link } from "react-router";
// import { highlightText } from "../../../shared/functions/utils.tsx";
import type { User } from "../../../shared/types.ts";
import { cn } from "../utils/utils.ts";
import { Skeleton } from "./ui/Skeleton.tsx";

function highlightText(text: string, query: string) {
	if (!query) return text;

	const regex = new RegExp(`(${query})`, "gi");
	const parts = text.split(regex);

	return parts.map((part, index) =>
		regex.test(part) ? (
			<mark key={`part-${index + 1}`} className="bg-yellow-300">
				{part}
			</mark>
		) : (
			part
		),
	);
}

export default function UserCard({
	user,
	bottomText,
	// showTypingStatus,
	// showLastMessageTime,
	className,
	highlight,
	showUsername = true,
	navigateTo,
}: {
	className?: string;
	user: Partial<User>;
	bottomText?: string;
	showTypingStatus?: boolean;
	showLastMessageTime?: boolean;
	highlight?: string;
	showUsername?: boolean;
	navigateTo?: string;
}) {
	return (
		<Link
			to={navigateTo || `/contacts/${user._id}`}
			className={cn(["flex items-center gap-4 p-2", className])}
		>
			<div className="w-12 aspect-square rounded-[5px] relative overflow-hidden">
				<img
					src={user.imageUrl}
					alt="user"
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
			<div className="flex flex-col items-start">
				<div className="flex flex-col items-start justify-center">
					<h3 className="font-bold">
						{highlightText(user.firstName as string, highlight as string)}{" "}
						{highlightText(user.lastName as string, highlight as string)}
					</h3>
					{showUsername && (
						<span className="text-xs font-normal ">
							@{highlightText(user.username as string, highlight as string)}
						</span>
					)}
					{/*{showTypingStatus && user.isTyping && (*/}
					{/*	<span className="text-xs text-muted/50">Typing...</span>*/}
					{/*)}*/}
				</div>
				<div className="flex items-center gap-2">
					<p className=" text-xs truncate max-w-40 text-left italic">
						{bottomText}
					</p>
					{/*{showLastMessageTime && (*/}
					{/*	<span className="text-xs text-muted/50 w-max">*/}
					{/*		&bull; {user.lastMessage}*/}
					{/*	</span>*/}
					{/*)}*/}
				</div>
			</div>
		</Link>
	);
}

export function UserCardSkeleton() {
	return (
		<div className="flex items-center gap-4">
			<Skeleton className="w-12 aspect-square rounded-[5px]" />
			<div className="flex flex-col items-start gap-1">
				<div className="flex items-center gap-2">
					<div className="flex flex-col gap-2">
						<Skeleton className="h-[2ex] w-[150px] rounded-[5px]" />
						<Skeleton className="h-[2ex] w-[100px] rounded-[5px]" />
					</div>
					<span className="text-xs text-muted/50 animate-pulse">Typing...</span>
				</div>
			</div>
		</div>
	);
}
