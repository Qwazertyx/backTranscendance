import { ChatType } from "../entities/chat.entity";
import { ChatInvite } from "../entities/chat-invite.entity";
import { ChatMember } from "../entities/chat-member.entity";
import { ChatMessage } from "../entities/chat-message.entity";
import { ChatRestriction } from "../entities/chat-restriction.entity";

export interface ChatDto {
	id: number;

	name: string;
	type: ChatType;

	members: ChatMember[];
	messages: ChatMessage[];
	invites: ChatInvite[];
	restrictions: ChatRestriction[];

	created_at: Date;
	updated_at: Date;
}