import { ManyToOne, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Chat } from './chat.entity';
import { ChatMember } from './chat-member.entity';
import { User } from './user.entity';

@Entity()
export class ChatInvite extends BaseEntity {
	@ManyToOne(() => Chat, chat => chat.messages, { nullable: false })
	chat: Chat;

	@ManyToOne(() => ChatMember, member => member.invitesSent, { nullable: false })
	author: ChatMember;

	@ManyToOne(() => User, user => user.receivedChatInvites, { nullable: false })
	receiver: User;
}