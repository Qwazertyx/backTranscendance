import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from "typeorm";

import { BaseEntity } from "./base.entity";
import { ChatMember } from "./chat-member.entity";
import { ChatRestriction } from "./chat-restriction.entity";
import { ChatMessage } from "./chat-message.entity";
import { ChatInvite } from "./chat-invite.entity";

export enum ChatType {
	DIRECT = 'direct',
	PRIVATE = 'private',
	PUBLIC = 'public'
}

@Entity()
export class Chat extends BaseEntity {
	@Column({ type: 'enum', enum: ChatType, nullable: false, default: ChatType.DIRECT })
	type: ChatType = ChatType.DIRECT;
	
	@Column({ type: 'varchar', length: 50, nullable: false, default: 'New Chat' })
	name: string;

	@OneToMany(() => ChatMember, member => member.chat)
	members: ChatMember[]

	@OneToMany(() => ChatMessage, message => message.chat)
	messages: ChatMessage[];

	@OneToMany(() => ChatInvite, invite => invite.chat)
	invites: ChatInvite[];
	
	@OneToMany(() => ChatRestriction, restriction => restriction.chat)
	restrictions: ChatRestriction[];
}