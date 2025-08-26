import FileIcon, { type MimeType } from "@/components/FileIcon.tsx";
import IconButton from "@/components/ui/IconButton.tsx";
import type { Dispatch, SetStateAction } from "react";

type NewFilesProps = {
	newFiles: (File & { id: string })[];
	setNewFiles: Dispatch<SetStateAction<(File & { id: string })[]>>;
};

export default function NewFiles({ newFiles, setNewFiles }: NewFilesProps) {
	return (
		<>
			{newFiles.map((file) => {
				return (
					<div
						className="border border-border rounded-md text-primary p-3 gap-5 flex items-center w-full relative"
						key={file.id}
					>
						<IconButton
							icon="close"
							className="absolute top-1 right-1 h-5 w-5 p-1"
							onClick={() =>
								setNewFiles((prev) => prev.filter((f) => f.id !== file.id))
							}
						/>
						<div className="flex-shrink-0 h-15 w-10">
							{file.type.startsWith("image") ? (
								<div className="overflow-hidden h-full aspect-[2/2.4] relative rounded">
									<img
										src={URL.createObjectURL(file)}
										alt=""
										className="absolute inset-0 object-cover h-full w-full"
									/>
								</div>
							) : (
								<FileIcon
									extension={file.name.split(".").slice(-1)[0] as MimeType}
								/>
							)}
						</div>
						<div className="flex flex-col overflow-hidden w-full">
							<span className="truncate block text-sm">{file.name}</span>
						</div>
					</div>
				);
			})}
		</>
	);
}
