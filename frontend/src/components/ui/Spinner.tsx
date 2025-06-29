import { MoonLoader } from "react-spinners";

export default function Spinner() {
	return (
		<div className="bg-primary h-full w-full grid place-items-center">
			<MoonLoader color={"var(--muted)"} />
		</div>
	);
}
