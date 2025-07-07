import type { IGif } from "@giphy/js-types";
import { Gif } from "@giphy/react-components";

type MessageGifsProps = {
	gifs: IGif[];
};

export default function MessageGifs({ gifs }: MessageGifsProps) {
	return (
		<div>
			{gifs.map((gif, index) => {
				return (
					<Gif
						className="cursor-auto"
						key={`gif-${index + 1}-${gif.id}`}
						gif={gif}
						width={200}
						onGifClick={(_gif, event) => event.preventDefault()}
					/>
				);
			})}
		</div>
	);
}
