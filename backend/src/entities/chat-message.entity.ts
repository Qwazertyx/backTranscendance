import { Column, ManyToOne, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Chat } from './chat.entity';
import { ChatMember } from './chat-member.entity';

@Entity()
export class ChatMessage extends BaseEntity {
	@ManyToOne(() => Chat, chat => chat.messages, { nullable: false })
	chat: Chat;
	
	@ManyToOne(() => ChatMember, member => member.messages, { nullable: false })
	author: ChatMember;

	@Column({ type: 'varchar', length: 2000, nullable: false })
	content: string;
}