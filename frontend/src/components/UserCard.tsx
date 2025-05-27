import type { User } from "../../../shared/types.ts";
import { cn } from "../utils/utils.ts";
import { Skeleton } from "./ui/Skeleton.tsx";
import {Link} from "react-router";

export default function UserCard({
	user,
	bottomText,
	showTypingStatus,
	showLastMessageTime,
	className,
}: {
	className?: string;
	user: User;
	bottomText?: string;
	showTypingStatus?: boolean;
	showLastMessageTime?: boolean;
}) {
	return (
		<Link to={`/contacts/${user._id}`} className={cn(["flex items-center gap-4", className])}>
			<img
				src="https://picsum.photos/id/100/50/50"
				alt="user"
				className="w-12 aspect-square rounded-[5px]"
			/>
			<div className="flex flex-col items-start gap-1">
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-white">
						{user.firstName} {user.lastName}
					</h3>
					{showTypingStatus && user.isTyping && (
						<span className="text-xs text-muted/50">Typing...</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					<p className="text-muted text-xs truncate max-w-40 text-left">
						{bottomText || user.message}
					</p>
					{showLastMessageTime && (
						<span className="text-xs text-muted/50 w-max">
							&bull; {user.lastMessage}
						</span>
					)}
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
