import { EmojiPicker } from "frimousse";
import IconButton from "../ui/IconButton.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover.tsx";

type EmojiPickerPopoverProps = {
	onSelect: (emoji: string) => void;
	onOpenChange: (open: boolean) => void;
	isOpen: boolean;
	className?: string;
};

export default function EmojiPickerPopover({
	onSelect,
	isOpen,
	onOpenChange,
	className = "",
}: EmojiPickerPopoverProps) {
	return (
		<Popover open={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger className={className} asChild>
				<IconButton icon="emoji" />
			</PopoverTrigger>
			<PopoverContent className="border-none w-fit">
				<EmojiPicker.Root className="isolate flex h-[368px] w-fit flex-col bg-background border-2 border-muted/50 rounded-xl">
					<EmojiPicker.Search className="z-10 mx-2 mt-2 border-1 text-primary appearance-none rounded-md bg-background px-2.5 py-2 text-sm placeholder:text-muted-foreground" />
					<EmojiPicker.Viewport className="relative flex-1 outline-hidden">
						<EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm ">
							Loading…
						</EmojiPicker.Loading>
						<EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
							No emoji found.
						</EmojiPicker.Empty>
						<EmojiPicker.List
							className="select-none pb-1.5"
							components={{
								CategoryHeader: ({ category, ...props }) => (
									<div
										className="bg-background px-2 pt-3 pb-1.5 font-medium text-primary text-xs"
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
