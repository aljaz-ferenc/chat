import { Button } from "@/components/ui/Button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type DemoUserCredentialsProps = {
	className?: string;
	creds: {
		username: string;
		password: string;
	};
};

export default function DemoUserCredentials({
	className = "",
	creds,
}: DemoUserCredentialsProps) {
	const [wasCopied, setWasCopied] = useState<"username" | "password" | null>(
		null,
	);

	const copyToClipboard = async (value: string) => {
		await navigator.clipboard.writeText(value);
		const target = value === creds.username ? "username" : "password";
		setWasCopied(target);

		setTimeout(() => setWasCopied(null), 1000);
	};

	return (
		<div className={cn(["flex flex-col gap-2", className])}>
			<span className="font-semibold text-primary-foreground">DEMO USER</span>
			<motion.div className="flex items-center gap-1 relative text-primary-foreground">
				<Input type="text" value={creds.username} readOnly />
				<Button
					type="button"
					className="cursor-pointer"
					onClick={() => copyToClipboard(creds.username)}
				>
					<Copy />
				</Button>
				<AnimatePresence>
					{wasCopied === "username" && (
						<motion.span
							key="username"
							initial={{ opacity: 0, y: 0 }}
							animate={{ opacity: 1, y: -5 }}
							exit={{ opacity: 0, y: 0 }}
							transition={{ duration: 0.3 }}
							className="text-xs text-green-500 absolute right-0 translate-x-[110%]"
						>
							<Check />
						</motion.span>
					)}
				</AnimatePresence>
			</motion.div>
			<div className="flex items-center gap-1 relative text-primary-foreground">
				<Input type="password" value={creds.password} readOnly />
				<Button
					type="button"
					className="cursor-pointer"
					onClick={() => copyToClipboard(creds.password)}
				>
					<Copy />
				</Button>
				<AnimatePresence>
					{wasCopied === "password" && (
						<motion.span
							key="password"
							initial={{ opacity: 0, y: 0 }}
							animate={{ opacity: 1, y: -5 }}
							exit={{ opacity: 0, y: 0 }}
							transition={{ duration: 0.3 }}
							className="text-xs text-green-500 absolute right-0 translate-x-[110%]"
						>
							<Check />
						</motion.span>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
