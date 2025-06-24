import { use } from "react";
import type { Message } from "../../../shared/types.ts";
import { FileStorageContext } from "../providers/FileStorageProvider.tsx";

export default function useDownloadFile() {
	const { storage } = use(FileStorageContext);

	return (fileId: Message["content"]["files"][0], bucketId: string) => {
		const downloadUrl = storage.getFileDownload(bucketId, fileId);
		const a = document.createElement("a");
		a.href = downloadUrl;
		a.download = downloadUrl;
		a.click();
	};
}
