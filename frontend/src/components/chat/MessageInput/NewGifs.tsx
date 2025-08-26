import type { IGif } from "@giphy/js-types";
import { Gif } from "@giphy/react-components";
import { X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type NewGifsProps = {
	gifs: IGif[];
	setGifs: Dispatch<SetStateAction<IGif[]>>;
};

export default function NewGifs({ gifs, setGifs }: NewGifsProps) {
	return (
		<div className="flex gap-3">
			{gifs.map((gif, index) => {
				return (
					<div
						key={`input-gif-${index + 1}-${gif.id}`}
						className="relative group"
					>
						<Gif
							className="cursor-auto"
							gif={gif}
							width={200}
							onGifClick={(_gif, event) => event.preventDefault()}
						/>
						<button
							type="button"
							className="opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer absolute h-5 w-5 top-1 right-1 bg-black/50 p-1 rounded-full hover:bg-black/70 transition"
							onClick={() =>
								setGifs((prev) => {
									return prev.filter((g) => g.id !== gif.id);
								})
							}
						>
							<X color="white" size={15} />
						</button>
					</div>
				);
			})}
		</div>
	);
}
