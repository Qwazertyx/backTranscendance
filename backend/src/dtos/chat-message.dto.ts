import { ChatMember } from "../entities/chat-member.entity";
import { Chat } from "../entities/chat.entity";

export interface ChatMessageDto {
	id: number;

	chat: Chat;
	author: ChatMember;
	content: string;

	created_at: Date;
	updated_at: Date;
}