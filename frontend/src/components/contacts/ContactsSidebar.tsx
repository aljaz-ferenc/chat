import { SearchIcon } from "@/assets/icons/icons.tsx";
import UserCard from "@/components/UserCard.tsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";
import useContacts from "@/hooks/api/useContacts.ts";
import { cn } from "@/utils/utils.ts";
import { useDebounce } from "@uidotdev/usehooks";
import { SidebarIcon, X } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Contact } from "../../../../shared/types.ts";

type ContactsSidebarProps = {
	setSidebarIsOpen?: Dispatch<SetStateAction<boolean>>;
	className?: string;
};

function ContactsSidebarBase({
	setSidebarIsOpen,
	className = "",
}: ContactsSidebarProps) {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);
	const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);
	const { data: contacts } = useContacts();
	const { contactId } = useParams();

	useEffect(() => {
		if (!contacts) return;
		const searchedUsers = contacts.filter((c) =>
			(c.firstName + c.lastName + c.username)
				.toLowerCase()
				.includes(debouncedQuery.toLowerCase().trim()),
		);
		setSearchedContacts(searchedUsers);
	}, [debouncedQuery, contacts]);

	return (
		<div
			className={cn([
				"h-full bg-background border-r border-border min-w-[320px]",
				className,
			])}
		>
			<div className="py-5 px-2 md:px-6 flex gap-4">
				<h3 className="font-bold text-2xl mr-auto text-primary">Contacts</h3>
				<button
					onClick={() => {
						setSidebarIsOpen?.(false);
						navigate("/contacts");
					}}
					type="button"
					className="flex pr-6 gap-2 items-center text-muted [&_svg]:fill-foreground font-bold text-xs cursor-pointer"
				>
					<SearchIcon />
					<span className="text-foreground">Search all users</span>
				</button>
			</div>
			<div className="flex items-center gap-2 [&_svg]:fill-muted relative px-2 md:px-6">
				<span className="absolute top-1/2 -translate-y-1/2 left-5 md:left-9 [&_svg]:p-[1px] [&_svg]:fill-muted-foreground">
					<SearchIcon />
				</span>
				<input
					type="text"
					className="w-full placeholder:text-muted-foreground pl-10 py-2 transition-all rounded-full focus-visible:bg-background focus-visible:outline-black  outline-1"
					placeholder="Search contacts"
					onChange={(e) => setQuery(e.target.value)}
					value={query}
				/>
				{query && (
					<button
						type="button"
						className="absolute top-1/2 -translate-y-1/2 right-5 md:right-9 [&_svg]:p-[1px] cursor-pointer"
						onClick={() => setQuery("")}
					>
						<X size={20} color={"var(--muted-foreground)"} />
					</button>
				)}
			</div>
			{contacts && (
				<div className="flex flex-col mt-4">
					{(query ? searchedContacts : contacts).map((user) => (
						<UserCard
							key={user._id}
							user={user}
							showLastMessageTime
							showTypingStatus
							className={cn([
								"py-2 md:py-3 cursor-pointer transition-all mx-2 md:mx-6 rounded-xl",
								contactId === user._id && "bg-foreground text-background",
							])}
							onClick={() => setSidebarIsOpen?.(false)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

//for mobile screens
function ContactsSidebarSheet({ className }: { className?: string }) {
	const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

	return (
		<div className={className}>
			<Sheet open={sidebarIsOpen} onOpenChange={setSidebarIsOpen}>
				<SheetTrigger className="mr-auto m-2">
					<SidebarIcon />
				</SheetTrigger>
				<SheetContent side="left" className="w-fit">
					<ContactsSidebarBase
						className="mt-2 w-full"
						setSidebarIsOpen={setSidebarIsOpen}
					/>
				</SheetContent>
			</Sheet>
		</div>
	);
}

export default function ContactsSidebar() {
	return (
		<>
			<ContactsSidebarSheet className="lg:hidden" />
			<ContactsSidebarBase className="hidden lg:block" />
		</>
	);
}
