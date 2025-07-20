import DirectChatPreview from "@/components/chat/ChatPreview/DirectChatPreview.tsx";
import GroupChatPreview from "@/components/chat/ChatPreview/GroupChatPreview.tsx";
import type { Chat } from "../../../../../shared/types.ts";

type ChatPreviewProps = {
	chat: Chat;
};

export default function ChatPreview({ chat }: ChatPreviewProps) {
	if (chat.type === "group") {
		return <GroupChatPreview chat={chat} />;
	}
	return <DirectChatPreview chat={chat} />;
}
