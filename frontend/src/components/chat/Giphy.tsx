import type { IGif } from "@giphy/js-types";
import {
	Grid,
	SearchBar,
	SearchContext,
	SearchContextManager,
} from "@giphy/react-components";
import { type SetStateAction, use } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover.tsx";

const GIPHY_KEY = import.meta.env.VITE_GIPHY_KEY;
if (!GIPHY_KEY) console.error("Missing GIPHY_KEY");

type GiphyProps = {
	onGifSelect: (gif: IGif) => void;
	open: boolean;
	setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function Giphy({ onGifSelect, open, setOpen }: GiphyProps) {
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className="text-muted">GIF</PopoverTrigger>
			<PopoverContent className="h-[400px] w-[800px] overflow-y-scroll bg-background border-muted/50 app-scrollbar">
				<SearchContextManager
					apiKey={GIPHY_KEY}
					shouldDefaultToTrending
					theme={{ darkMode: true }}
				>
					<Components onGifSelect={onGifSelect} />
				</SearchContextManager>
			</PopoverContent>
		</Popover>
	);
}

function Components({ onGifSelect }: { onGifSelect: (gif: IGif) => void }) {
	const { fetchGifs, searchKey } = use(SearchContext);

	return (
		<div className="flex flex-col gap-2">
			<SearchBar />
			<Grid
				width={750}
				columns={3}
				fetchGifs={fetchGifs}
				key={searchKey}
				onGifClick={(gif, event) => {
					event.preventDefault();
					onGifSelect(gif);
				}}
			/>
		</div>
	);
}
