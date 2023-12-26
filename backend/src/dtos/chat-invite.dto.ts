import { ChatMember } from "../entities/chat-member.entity";
import { Chat } from "../entities/chat.entity";
import { User } from "../entities/user.entity";

export interface ChatInviteDto {
	id: number;

	chat: Chat;
	author: ChatMember;
	receiver: User;

	created_at: Date;
	updated_at: Date;
}