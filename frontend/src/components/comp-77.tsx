import { useId } from "react";

import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
	const id = useId();
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={id}>Autogrowing textarea</Label>
			<Textarea
				id={id}
				placeholder="Leave a comment"
				className="field-sizing-content max-h-29.5 min-h-0 resize-none py-1.75"
			/>
		</div>
	);
}
