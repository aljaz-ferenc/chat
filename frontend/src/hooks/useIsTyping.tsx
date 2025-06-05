import { type RefObject, useEffect, useRef, useState } from "react";

export default function useIsTyping(
	inputRef: RefObject<HTMLElement>,
	delay = 1000,
) {
	const [isTyping, setIsTyping] = useState(false);
	const timer = useRef<number | null>(null);

	useEffect(() => {
		const element = inputRef.current;
		if (!element) return;

		const handleTyping = () => {
			setIsTyping(true);

			if (timer.current) {
				clearTimeout(timer.current);
			}

			timer.current = window.setTimeout(() => {
				setIsTyping(false);
				timer.current = null;
			}, delay);
		};

		element.addEventListener("keydown", handleTyping);

		return () => {
			element.removeEventListener("keydown", handleTyping);
			if (timer.current) {
				clearTimeout(timer.current);
			}
		};
	}, [inputRef, delay]);

	return isTyping;
}
