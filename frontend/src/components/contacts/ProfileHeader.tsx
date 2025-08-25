import { cn } from "@/utils/utils.ts";
import { ID } from "appwrite";
import { type ChangeEvent, use, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Contact } from "../../../../shared/types.ts";
import { EditIcon } from "../../assets/icons/icons.tsx";
import useUpdateUser from "../../hooks/api/useUpdateUser.ts";
import { FileStorageContext } from "../../providers/FileStorageProvider.tsx";
import useUserStore from "../../state/useUserStore.ts";

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

type ProfileHeaderProps = {
	user: Contact;
	editable?: boolean;
};

export function ProfileHeader({ user, editable = false }: ProfileHeaderProps) {
	const imageInputRef = useRef<HTMLInputElement>(null);
	const { storage } = use(FileStorageContext);
	const { mutateAsync: updateUser } = useUpdateUser();
	const [bgImage, setBgImage] = useState("");
	const thisUserId = useUserStore(useShallow((state) => state.user?._id));

	const handleEditImage = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const image = e.target.files[0];
		if (!image) return;

		try {
			const uploadedImage = await storage.createFile(
				BUCKET_ID,
				ID.unique(),
				image,
			);
			await updateUser({ bgImage: uploadedImage.$id });
			setBgImage(storage.getFileView(BUCKET_ID, uploadedImage.$id));
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!storage || !user?.bgImage) return;
		const imageUrl = storage.getFileView(BUCKET_ID, user.bgImage);
		setBgImage(imageUrl);
	}, [storage, user]);

	console.log(user);

	return (
		<div className="bg-background rounded-2xl overflow-hidden w-full max-w-6xl mx-auto relative">
			{/*BACKGROUND IMAGE*/}
			<div className="w-full md:h-[500px] h-[250px] relative overflow-hidden group ">
				{editable && (
					<button
						type="button"
						onClick={() => imageInputRef.current?.click()}
						className="absolute top-3 right-3 z-30 h-8 w-8 cursor-pointer hidden group-hover:block [&_svg]:fill-[var(--muted)]"
					>
						<EditIcon />
					</button>
				)}
				{bgImage && (
					<img
						className={cn([
							"absolute inset-0 object-cover w-full h-full object-center transition",
							thisUserId === user._id && "group-hover:brightness-50",
						])}
						src={bgImage}
						alt=""
					/>
				)}
				<input
					type="file"
					className="hidden"
					ref={imageInputRef}
					onChange={handleEditImage}
				/>
			</div>
			<div className="px-2 md:px-8 absolute bottom-0 w-full">
				{/*PROFILE PIC*/}
				<div className="mb-2 md:mb-0 flex text-white justify-evenly md:justify-start md:gap-5 w-full items-center">
					<div className="relative md:h-[150px] md:w-[150px] h-[100px] w-[100px] border-border border-2 rounded-xl overflow-hidden md:-translate-y-8">
						<img
							src={user.imageUrl || "https://picsum.photos/300"}
							alt=""
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="md:mt-6 bg-black/70 rounded-xl md:p-3 p-2 h-fit backdrop-blur-xs">
						<h3 className="flex flex-col md:flex-row md:items-baseline md:gap-2">
							<span className="font-bold text-lg">
								{user.firstName} {user.lastName}
							</span>{" "}
							<span className="text-xs md:text-sm text-gray-100">
								@{user.username}
							</span>
						</h3>
						<div>
							<span className="text-xs md:text-sm text-gray-100">
								{user.friends.friends.length} Contacts
							</span>
							{!!user?.mutualFriends && (
								<span className="text-xs text-gray-100">
									{" "}
									&bull; {user?.mutualFriends.length} Mutual
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
