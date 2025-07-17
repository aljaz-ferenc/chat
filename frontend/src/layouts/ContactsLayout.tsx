import { useDebounce } from "@uidotdev/usehooks";
import { SidebarIcon, X } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import type { Contact } from "../../../shared/types.ts";
import { SearchIcon } from "../assets/icons/icons.tsx";
import UserCard from "../components/UserCard.tsx";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet.tsx";
import useContacts from "../hooks/api/useContacts.ts";
import { cn } from "../utils/utils.ts";

export default function ContactsLayout() {
	const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
	return (
		<div className="flex flex-col lg:flex-row">
			<div className="lg:hidden">
				<Sheet open={sidebarIsOpen} onOpenChange={setSidebarIsOpen}>
					<SheetTrigger className="mr-auto m-2">
						<SidebarIcon />
					</SheetTrigger>
					<SheetContent side="left" className="">
						<ContactsSidebar
							className="mt-2 w-full"
							setSidebarIsOpen={setSidebarIsOpen}
						/>
					</SheetContent>
				</Sheet>
			</div>
			<ContactsSidebar className="hidden lg:block min-w-[320px]" />
			<div className="w-full flex flex-col h-full">
				<Outlet />
			</div>
		</div>
	);
}

type ContactsSidebarProps = {
	setSidebarIsOpen?: Dispatch<SetStateAction<boolean>>;
	className?: string;
};

function ContactsSidebar({
	setSidebarIsOpen,
	className = "",
}: ContactsSidebarProps) {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);
	const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);
	const { data: contacts } = useContacts();

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
			className={cn(["h-full bg-background border-r border-border", className])}
		>
			<div className="py-5 px-6 flex gap-4">
				<h3 className="font-bold text-2xl mr-auto text-primary">Contacts</h3>
				<button
					onClick={() => {
						setSidebarIsOpen?.(false);
						navigate("/contacts");
					}}
					type="button"
					className="flex gap-2 items-center text-muted [&_svg]:fill-foreground font-bold text-xs cursor-pointer"
				>
					<SearchIcon />
					<span className="text-foreground">Search all users</span>
				</button>
				{/*<button*/}
				{/*	type="button"*/}
				{/*	className="flex gap-2 items-center text-muted [&_svg]:fill-muted font-bold text-xs hover:text-message-primary hover:[&_svg]:fill-message-primary cursor-pointer"*/}
				{/*>*/}
				{/*	<FilterIcon />*/}
				{/*	<span>Filter</span>*/}
				{/*</button>*/}
			</div>
			<div className="flex items-center gap-2 [&_svg]:fill-muted relative px-6">
				<span className="absolute top-1/2 -translate-y-1/2 left-9 [&_svg]:p-[1px] [&_svg]:fill-muted-foreground">
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
						className="absolute top-1/2 -translate-y-1/2 right-9 [&_svg]:p-[1px] cursor-pointer"
						onClick={() => setQuery("")}
					>
						<X size={20} color={"var(--muted-foreground)"} />
					</button>
				)}
			</div>
			{contacts && (
				<div className="flex flex-col mt-4">
					{(query ? searchedContacts : contacts).map((user) => (
						<Link
							to={`${user._id}`}
							className={cn(["cursor-pointer transition-all px-6"])}
							key={user._id}
							type="button"
							onClick={() => setSidebarIsOpen?.(false)}
						>
							<UserCard
								user={user}
								showLastMessageTime
								showTypingStatus
								className="py-3"
							/>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
