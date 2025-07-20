import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog.tsx";
import useRenameChat from "@/hooks/api/useRenameChat.ts";
import { type Dispatch, type SetStateAction, useState } from "react";

type RenameGroupDialogProps = {
	renameDialogIsOpen: boolean;
	setRenameDialogIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function RenameGroupDialog({
	renameDialogIsOpen,
	setRenameDialogIsOpen,
}: RenameGroupDialogProps) {
	const [groupName, setGroupName] = useState("");
	const { mutateAsync: renameChat } = useRenameChat();

	return (
		<Dialog open={renameDialogIsOpen} onOpenChange={setRenameDialogIsOpen}>
			<DialogContent className="bg-background text-primary">
				<DialogHeader>
					<DialogTitle>Rename Group</DialogTitle>
				</DialogHeader>
				<input
					type="text"
					className="w-full border-1 placeholder:text-muted-foreground border-border text-primary p-2 rounded"
					placeholder="New group name"
					value={groupName}
					onChange={(e) => setGroupName(e.target.value)}
				/>
				<DialogFooter className="[&_svg]:h-5">
					<button
						type="button"
						className="border-1 border-border text-base cursor-pointer transition rounded-xl px-3 py-1 flex items-center gap-1"
						onClick={async () => {
							await renameChat(groupName);
							setRenameDialogIsOpen(false);
							setGroupName("");
						}}
					>
						<span>Rename</span>
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
