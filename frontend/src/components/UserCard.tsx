import { Link } from "react-router";
import type { User } from "../../../shared/types.ts";
import { cn } from "../utils/utils.ts";

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
				</div>
				<div className="flex items-center gap-2">
					<p className=" text-xs truncate max-w-40 text-left italic">
						{bottomText}
					</p>
				</div>
			</div>
		</Link>
	);
}
