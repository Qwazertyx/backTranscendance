import { Chat } from '../entities/chat.entity';
import { ChatInvite } from '../entities/chat-invite.entity';
import { ChatMemberRole } from '../entities/chat-member.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { ChatRestriction } from '../entities/chat-restriction.entity';
import { User } from '../entities/user.entity';

export interface ChatMemberDto {
	id: number;

	user: User;
	chat: Chat;
	role: ChatMemberRole;
	restrictions: ChatRestriction[];
	messages: ChatMessage[];
	invitesSent: ChatInvite[];

	created_at: Date;
	updated_at: Date;
}