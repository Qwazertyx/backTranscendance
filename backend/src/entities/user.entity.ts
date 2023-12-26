import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm'

// Entities
import { BaseEntity } from './base.entity';
import { FriendRequest } from './friend-request.entity';
import { Match } from './match.entity';
import { ChatMember } from './chat-member.entity';
import { ChatInvite } from './chat-invite.entity';

export enum Role {
	ADMIN = 'admin',
	USER = 'user',
}

@Entity()
export class User extends BaseEntity {
	// Authentication
	@Column({ unique: true, nullable: false, type: 'varchar', length: 50 })
	username: string;

	@Column({ unique: true, nullable: false, type: 'varchar', length: 50 })
	displayname: string;

	@Column({ unique: true, nullable: false, type: 'varchar', length: 50 })
	email: string;

	@Column({ nullable: false, type: 'varchar', length: 64 })
	password: string;

	// User info
	@Column({ nullable: true, type: 'varchar', length: 256, default: '' })
	avatar: string;

	@Column({ nullable: true, type: 'varchar', length: 30, default: 'image/png' })
	avatarMimeType: string;

	@Column({ type: 'enum', enum: Role, default: Role.USER })
	role?: Role;

	// 2FA
	@Column({ nullable: false, type: 'int', default: 42 })
	schoolId: number;

	@Column({ type: 'boolean', default: false })
	is2FAEnabled: boolean;

	@Column({ nullable: true, type: 'varchar', length: 64 })
	secret?: string;

	// Friends
	@ManyToMany(() => User, user => user.friends)
	@JoinTable()
	friends: User[];

	@OneToMany(() => FriendRequest, friend_request => friend_request.sender)
	sentFriendRequests: FriendRequest[];

	@OneToMany(() => FriendRequest, friend_request => friend_request.receiver)
	receivedFriendRequests: FriendRequest[];

	// Chats
	@OneToMany(() => ChatMember, member => member.user)
	chatsMember: ChatMember[];

	@OneToMany(() => ChatInvite, invite => invite.receiver)
	receivedChatInvites: ChatInvite[];

	// Blocked users
	@ManyToMany(() => User, user => user.blockedBy)
	@JoinTable()
	blockedUsers: User[];

	@ManyToMany(() => User, user => user.blockedUsers)
	blockedBy: User[];

	// Matches and stats
	@Column({ type: 'float', default: 1000.0 })
	elo?: number;

	@Column({ type: 'int', default: -1 })
	rank?: number;

	@OneToMany(() => Match, match => match.player1)
	matchesAsP1: Match[];

	@OneToMany(() => Match, match => match.player2)
	matchesAsP2: Match[];

	@Column({ type: 'int', default: 0 })
	matchesCount?: number;

	@Column({ type: 'int', default: 0 })
	winCount?: number;

	@Column({ type: 'int', default: 0 })
	lossCount?: number;

	@Column({ type: 'int', default: 0 })
	drawCount?: number;

	// Game options
	@Column({ type: 'varchar', length: 6, default: '0090FF' })
	colorOne?: string;

	@Column({ type: 'varchar', length: 6, default: 'F23F42' })
	colorTwo?: string;

	@Column({ type: 'varchar', length: 64, default: 'KeyW' })
	upKey?: string;

	@Column({ type: 'varchar', length: 64, default: 'KeyS' })
	downKey?: string;

	@Column({ type: 'varchar', length: 64, default: 'KeyE' })
	extraKey?: string;
}
