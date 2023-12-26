import { Column, OneToMany, ManyToOne, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Chat } from './chat.entity';
import { ChatMember } from './chat-member.entity';


export enum ChatRestrictionType {
	BANNED = 'banned',
	MUTED = 'muted'
}

@Entity()
export class ChatRestriction extends BaseEntity {
	@ManyToOne(() => ChatMember, member => member.restrictions, { nullable: false })
	target: ChatMember;

	@ManyToOne(() => Chat, chat => chat.restrictions, { nullable: false })
	chat: Chat;

	@Column({ type: 'enum', enum: ChatRestrictionType, nullable: false, default: ChatRestrictionType.MUTED })
	type: ChatRestrictionType = ChatRestrictionType.MUTED;

	@Column({ type: 'boolean', nullable: false, default: true })
	permanent: boolean = true;

	@Column({ type: 'date', nullable: true, default: null})
	expiration: Date;
}