import type { Models } from "appwrite";
import { use, useEffect, useState } from "react";
import type { Chat } from "../../../../shared/types.ts";
import { DownloadIcon } from "../../assets/icons/icons.tsx";
import useMessages from "../../hooks/api/useMessages.ts";
import useDownloadFile from "../../hooks/useDownloadFile.tsx";
import { FileStorageContext } from "../../providers/FileStorageProvider.tsx";
import FileIcon, { type MimeType } from "../FileIcon.tsx";

export default function SharedFiles({ chatId }: { chatId: Chat["_id"] }) {
	const { data: messages } = useMessages(chatId);
	const { storage } = use(FileStorageContext);
	const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
	const [files, setFiles] = useState<Models.File[]>([]);
	const downloadFile = useDownloadFile();
	console.log(files);

	useEffect(() => {
		const fetchFiles = async () => {
			if (!messages) return;

			const allFiles: Models.File[] = [];

			for (const page of messages.pages) {
				for (const m of page.messages) {
					if (m.content.files.length) {
						const fetchedFiles = await Promise.all(
							m.content.files.map((fileId: Models.File["$id"]) =>
								storage.getFile(BUCKET_ID, fileId),
							),
						);
						allFiles.push(...fetchedFiles);
					}
				}
			}

			setFiles(allFiles);
		};

		fetchFiles();
	}, [messages, storage]);

	return (
		<div className="p-6 min-w-xs">
			<h3 className="text-muted mb-3">Shared Files</h3>
			<div className=" flex flex-col gap-3">
				{files.map((file) => {
					return (
						<div className="text-white flex gap-2 items-center" key={file.$id}>
							<div className="relative aspect-[2/2.4] rounded mr-auto overflow-hidden text-[60%] w-10">
								{file.mimeType.startsWith("image") ? (
									<img
										src={storage.getFileView(BUCKET_ID, file.$id)}
										alt={file.name}
										className="absolute inset-0 object-cover h-full w-full"
									/>
								) : (
									<div className="mr-0">
										<FileIcon
											extension={file.name.split(".").slice(-1)[0] as MimeType}
										/>
									</div>
								)}
							</div>
							<span className="text-sm">{file.name}</span>
							<button
								type="button"
								className="w-8 cursor-pointer ml-auto"
								onClick={() => downloadFile(file.$id, BUCKET_ID)}
							>
								<DownloadIcon />
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}
