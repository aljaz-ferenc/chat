import ChatSidebar from "@/components/chat/ChatSidebar.tsx";
import { useState } from "react";
import { Outlet } from "react-router";
import type { Message as TMessage } from "../../../shared/types.ts";
import MessageInput from "../components/chat/MessageInput.tsx";

export default function ChatLayout() {
	const [replyingTo, setReplyingTo] = useState<TMessage | null>(null);

	return (
		<div className="grid lg:grid-cols-[320px_1fr] grid-cols-[1fr] grid-rows-[1fr_auto] lg:flex-row relative h-[calc(100vh-65px)] md:h-[calc(100vh-90px)]">
			<ChatSidebar />
			<Outlet context={{ replyingTo, setReplyingTo }} />
			<MessageInput
				replyingTo={replyingTo}
				setReplyingTo={setReplyingTo}
				className="mt-auto"
			/>
		</div>
	);
}
