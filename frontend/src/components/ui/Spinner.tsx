import { MoonLoader } from "react-spinners";

type SpinnerProps = {
	size?: number;
};

export default function Spinner({ size = 30 }: SpinnerProps) {
	return (
		<div className="bg-transparent h-full w-full grid place-items-center">
			<MoonLoader size={size} color={"var(--primary)"} />
		</div>
	);
}
