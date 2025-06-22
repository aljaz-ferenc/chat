import { isSameDay } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Contact } from "../../../shared/types.ts";
import useUpdateUser from "../hooks/api/useUpdateUser.ts";
import useUserStore from "../state/useUserStore.ts";
import Header from "./Header.tsx";
import { ProfileHeader } from "./contacts/ProfileHeader.tsx";
import { Button } from "./ui/Button.tsx";
import { Calendar } from "./ui/Calendar.tsx";
import { Label } from "./ui/Label.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover.tsx";

export default function Profile() {
	const user = useUserStore(useShallow((state) => state.user));
	const [about, setAbout] = useState(user?.about || "");
	const [socials, setSocials] = useState({
		Facebook: user?.socials?.facebook || "",
		X: user?.socials?.x || "",
		Instagram: user?.socials?.instagram || "",
		TikTok: user?.socials?.tiktok || "",
	});
	const [birthday, setBirthday] = useState<Date>(() => {
		if (user?.birthday) {
			return new Date(user?.birthday);
		}
		return new Date();
	});
	const [open, setOpen] = useState(false);
	const { mutateAsync: updateUser } = useUpdateUser();
	const [hasChanged, setHasChanged] = useState(false);

	useEffect(() => {
		if (!user) return;
		setAbout(user.about || "");
		setSocials({
			Facebook: user.socials?.facebook || "",
			X: user.socials?.x || "",
			Instagram: user.socials?.instagram || "",
			TikTok: user.socials?.tiktok || "",
		});
		if (user.birthday) {
			setBirthday(new Date(user.birthday));
		}
	}, [user]);

	useEffect(() => {
		if (!user) return;

		const areInputsSame =
			about === user.about &&
			socials.X === user.socials.x &&
			socials.Facebook === user.socials.facebook &&
			socials.TikTok === user.socials.tiktok &&
			socials.Instagram === user.socials.instagram &&
			isSameDay(user.birthday, birthday);

		setHasChanged(!areInputsSame);
	}, [about, socials, birthday, user]);

	if (!user) return null;

	return (
		<div className="bg-background h-full w-full flex flex-col">
			<div className="h-[72px] mb-6">
				<Header />
			</div>
			<ProfileHeader user={user as Contact} />
			<div className="w-full max-w-6xl mx-auto mt-6 bg-primary rounded-xl px-6 py-3 text-muted flex flex-col gap-10 overflow-y-scroll mb-6">
				<div className="flex flex-col gap-2">
					<span className="font-bold">About</span>
					<textarea
						className="rounded-xl bg-background p-2"
						name="about"
						id="about"
						rows={10}
						value={about}
						onChange={(e) => setAbout(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<span className="font-bold">Socials</span>
					<div>
						<div className="flex flex-col gap-2">
							{Object.entries(socials).map(([social, value]) => {
								return (
									<div key={social} className="flex">
										<div className="w-20">{social}</div>
										<input
											type="text"
											value={value}
											className="bg-background rounded w-md p-1 px-2"
											onChange={(e) =>
												setSocials(() => {
													return { ...socials, [social]: e.target.value };
												})
											}
										/>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<span className="font-bold">Birthday</span>
					<div className="flex flex-col gap-3">
						<Label htmlFor="date" className="px-1">
							Date of birth
						</Label>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									id="date"
									className="w-48 justify-between font-normal"
								>
									{birthday ? birthday.toLocaleDateString() : "Select date"}
									<ChevronDownIcon />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-auto overflow-hidden p-0 bg-white"
								align="start"
							>
								<Calendar
									weekStartsOn={1}
									mode="single"
									selected={birthday}
									captionLayout="dropdown"
									onSelect={(date) => {
										if (date) {
											setBirthday(date);
										}
										setOpen(false);
									}}
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>
				<Button
					disabled={!hasChanged}
					className="text-left w-fit px-3 py-1 rounded-xl"
					variant="default"
					onClick={async () =>
						await updateUser({
							about: about,
							socials: {
								facebook: socials.Facebook,
								x: socials.X,
								instagram: socials.Instagram,
								tiktok: socials.TikTok,
							},
							birthday,
						}).then(() => setHasChanged(false))
					}
				>
					Save changes
				</Button>
			</div>
		</div>
	);
}
