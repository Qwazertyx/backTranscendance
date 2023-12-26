import { PartialType } from '@nestjs/mapped-types';

import { User, Role } from '../entities/user.entity';
import { FriendRequest } from '../entities/friend-request.entity';
import { Match } from '../entities/match.entity';
import { ChatMember } from '../entities/chat-member.entity';
import { ChatInvite } from '../entities/chat-invite.entity';
import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestDto } from './friend-request.dto';
import { ChatMemberDto } from './chat-member.dto';
import { ChatInviteDto } from './chat-invite.dto';
import { MatchDto } from './match.dto';
import { Exclude } from 'class-transformer';

export interface UserDto {
	id: number;

	username: string;
	displayname: string;
	email: string;
	password: string;

	avatar: string;
	avatarMimeType: string;
	role: Role;

	schoolId: string;
	is2FAEnabled: boolean;
	secret: string;

	friends: User[];
	sentFriendRequests: FriendRequest[];
	receivedFriendRequests: FriendRequest[];

	chatsMember: ChatMember[];
	receivedChatInvites: ChatInvite[];

	blockedUsers: User[];
	blockedBy: User[];

	elo: number;
	rank: number;
	matchesAsP1: Match[];
	matchesAsP2: Match[];

	matchesCount: number;
	winCount: number;
	lossCount: number;
	drawCount: number;
}

export class GenericUserDto {
	@ApiProperty()
	id: number;
	@ApiProperty()
	username: string;
	@ApiProperty()
	displayname: string;
	@ApiProperty()
	avatar: string;
}

export class DetailedUserDto {
	@ApiProperty()
	id: number;
	@ApiProperty()
	username: string;
	@ApiProperty()
	displayname: string;
	@ApiProperty()
	email: string;
	@ApiProperty()
	avatar: string;
	@ApiProperty()
	role: Role;
	@ApiProperty()
	is2FAEnabled: boolean;
	@ApiProperty()
	friends: GenericUserDto[];
	@ApiProperty()
	sentFriendRequests: FriendRequestDto[];
	@ApiProperty()
	receivedFriendRequests: FriendRequestDto[];
	@ApiProperty()
	chatsMember: ChatMemberDto[];
	@ApiProperty()
	receivedChatInvites: ChatInviteDto[];
	@ApiProperty()
	blockedUsers: GenericUserDto[];
	@ApiProperty()
	blockedBy: GenericUserDto[];
	@ApiProperty()
	xp: number;
	@ApiProperty()
	matchesCount: number;
	@ApiProperty()
	matchesWon: MatchDto[];
	@ApiProperty()
	matchesLost: MatchDto[];
}

export class UpdateUserEmailDto {
	@ApiProperty()
	email: string;
	@ApiProperty()
	password: string;
}

export class UpdateUserPasswordDto {
	@ApiProperty()
	oldPassword: string;
	@ApiProperty()
	newPassword: string;
}

export class UpdateUserAvatarDto {
	@ApiProperty()
	avatar: string;
}

export class UpdateUserDisplaynameDto {
	@ApiProperty()
	displayname: string;
}