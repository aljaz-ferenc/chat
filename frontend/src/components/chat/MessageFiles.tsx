import { use, useEffect, useState } from "react";
import type { Message as TMessage } from "../../../../shared/types.ts";
import { DownloadIcon } from "../../assets/icons/icons.tsx";
import useDownloadFile from "../../hooks/useDownloadFile.tsx";
import { FileStorageContext } from "../../providers/FileStorageProvider.tsx";
import { cn } from "../../utils/utils.ts";
import FileIcon, { type MimeType } from "../FileIcon.tsx";

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

type MessageFilesProps = {
	files: TMessage["content"]["files"];
};

export default function MessageFiles({ files }: MessageFilesProps) {
	const { storage } = use(FileStorageContext);
	const [previews, setPreviews] = useState<
		{
			previewUrl: string;
			fileId: string;
			mimeType: string;
			name: string;
			sizeOriginal: number;
		}[]
	>([]);
	const downloadFile = useDownloadFile();

	useEffect(() => {
		const loadPreviews = async () => {
			const previewUrls = await Promise.all(
				files.map(async (file) => {
					const { mimeType, name, sizeOriginal } = await storage.getFile(
						BUCKET_ID,
						file,
					);
					return {
						previewUrl: storage.getFileView(BUCKET_ID, file),
						fileId: file,
						mimeType,
						name,
						sizeOriginal,
					};
				}),
			);
			setPreviews(previewUrls);
		};

		loadPreviews();
	}, [files, storage]);

	return (
		<div className="flex flex-col items-start flex-wrap gap-3 h-full">
			{previews.map((preview) => (
				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
				<div
					onClick={() => downloadFile(preview.fileId, BUCKET_ID)}
					key={preview.fileId}
					className="relative group/preview cursor-pointer"
				>
					{preview.mimeType.startsWith("image") ? (
						<div className="h-30 w-30">
							<img
								className="rounded-xl h-full w-full object-cover group-hover/preview:brightness-30 group-hover/preview:blur-xs transition"
								src={preview.previewUrl}
								alt=""
							/>
						</div>
					) : (
						<div className="h-full [&_svg]:h-full flex items-center gap-2">
							<div className="h-15 mx-auto group-hover/preview:brightness-30 group-hover/preview:blur-xs transition">
								<FileIcon
									extension={preview.name.split(".").slice(-1)[0] as MimeType}
								/>
							</div>
							<div className="text-muted-foreground text-center text-sm">
								{preview.name}
							</div>
						</div>
					)}
					<div
						className={cn([
							"z-40 absolute inset-0 [&_svg]:h-[90%] opacity-0 group-hover/preview:opacity-100 transition",
							preview.mimeType.startsWith("image") &&
								"top-1/2 left-1/2 -translate-1/2",
						])}
					>
						<DownloadIcon />
					</div>
				</div>
			))}
		</div>
	);
}
