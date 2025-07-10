import { EmojiPicker } from "frimousse";
import IconButton from "../ui/IconButton.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover.tsx";

type EmojiPickerPopoverProps = {
	onSelect: (emoji: string) => void;
	onOpenChange: (open: boolean) => void;
	isOpen: boolean;
};

export default function EmojiPickerPopover({
	onSelect,
	isOpen,
	onOpenChange,
}: EmojiPickerPopoverProps) {
	return (
		<Popover open={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger>
				<IconButton icon="emoji" />
			</PopoverTrigger>
			<PopoverContent className="border-none">
				<EmojiPicker.Root className="isolate flex h-[368px] w-fit flex-col bg-white dark:bg-background border-2 border-muted/50 rounded-xl">
					<EmojiPicker.Search className="z-10 mx-2 mt-2 text-white appearance-none rounded-md bg-neutral-100 px-2.5 py-2 text-sm dark:bg-background placeholder:text-muted" />
					<EmojiPicker.Viewport className="relative flex-1 outline-hidden">
						<EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
							Loading…
						</EmojiPicker.Loading>
						<EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
							No emoji found.
						</EmojiPicker.Empty>
						<EmojiPicker.List
							className="select-none pb-1.5"
							components={{
								CategoryHeader: ({ category, ...props }) => (
									<div
										className="bg-white px-3 pt-3 pb-1.5 font-medium text-neutral-600 text-xs dark:bg-primary dark:text-white"
										{...props}
									>
										{category.label}
									</div>
								),
								Row: ({ children, ...props }) => (
									<div className="" {...props}>
										{children}
									</div>
								),
								Emoji: ({ emoji, ...props }) => (
									<button
										className="flex size-8 items-center justify-center rounded-md text-lg data-[active]:bg-neutral-100 dark:data-[active]:bg-neutral-800"
										{...props}
										onClick={(val) => onSelect(val.currentTarget.innerText)}
									>
										{emoji.emoji}
									</button>
								),
							}}
						/>
					</EmojiPicker.Viewport>
				</EmojiPicker.Root>
			</PopoverContent>
		</Popover>
	);
}
