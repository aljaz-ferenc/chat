import type { User } from "../../../../shared/types.ts";
import { cn } from "../../utils/utils.ts";

type UserTagProps = {
	user: User;
	className?: string;
};

export default function UserTag({ user, className = "" }: UserTagProps) {
	return (
		<span
			className={cn([
				"bg-orange-500 text-muted rounded-full px-2 py-0.2 h-[3.25ex]",
				className,
			])}
		>
			@{user.firstName} {user.lastName}
		</span>
	);
}
