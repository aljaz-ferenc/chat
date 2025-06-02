import { useParams } from "react-router";
import useMessages from "../../hooks/api/useMessages.ts";

export default function Messages() {
	const { chatId } = useParams();
	const { data: messages } = useMessages(chatId);

	if (!messages) return <div>Loading messages...</div>;

	return (
		<div className="h-full">
			{messages.map((message) => (
				<p key={message._id}>{message.content.markdown}</p>
			))}
		</div>
	);
}
