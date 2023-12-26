import { ChatMember } from "../entities/chat-member.entity";
import { ChatRestrictionType } from "../entities/chat-restriction.entity";
import { Chat } from "../entities/chat.entity";

export interface ChatRestrictionDto {
	id : number;

	target: ChatMember;
	chat: Chat;
	type: ChatRestrictionType;
	permanent: boolean;
	expiration: Date;

	created_at: Date;
	updated_at: Date;
}