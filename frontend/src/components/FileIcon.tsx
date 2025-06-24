import { FileIcon as FileIconComponent } from "../assets/icons/icons.tsx";

export type MimeType = "txt";

type FileIconProps = {
	extension: MimeType;
};

export default function FileIcon({ extension }: FileIconProps) {
	return (
		<div className="h-full aspect-[2/2.4] min-w-2 relative [&_svg]:w-full">
			<span className="text-[1.5ex] uppercase font-bold absolute bottom-[15%] left-1/2 -translate-x-1/2 text-black">
				{extension}
			</span>
			<FileIconComponent />
		</div>
	);
}
