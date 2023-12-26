import { Column, OneToMany, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Chat } from './chat.entity';
import { ChatRestriction } from './chat-restriction.entity';
import { ChatMessage } from './chat-message.entity';
import { ChatInvite } from './chat-invite.entity';

export enum ChatMemberRole {
	OWNER = 'owner',
	ADMIN = 'admin',
	MEMBER = 'member'
}

@Entity()
export class ChatMember extends BaseEntity {
	@ManyToOne(() => User, user => user.chatsMember, { nullable: false })
	user: User;
	
	@ManyToOne(() => Chat, chat => chat.members, { nullable: false })
	chat: Chat;

	@Column({ type: 'enum', enum: ChatMemberRole, nullable: false, default: ChatMemberRole.MEMBER })
	role: ChatMemberRole = ChatMemberRole.MEMBER;

	@OneToMany(() => ChatRestriction, restriction => restriction.target)
	restrictions: ChatRestriction[];

	@OneToMany(() => ChatMessage, message => message.author)
	messages: ChatMessage[];

	@OneToMany(() => ChatInvite, invite => invite.author)
	invitesSent: ChatInvite[];
}