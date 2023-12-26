import { FriendRequestDto } from 'src/dtos/friend-request.dto';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { FriendRequest } from '../entities/friend-request.entity';
import { Chat } from '../entities/chat.entity';
import { ChatMember } from '../entities/chat-member.entity';
import { ChatInvite } from '../entities/chat-invite.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { ChatRestriction } from '../entities/chat-restriction.entity';
import { Match } from '../entities/match.entity';
import { UserDto } from 'src/dtos/user.dto';
import { ChatDto } from 'src/dtos/chat.dto';
import { ChatMemberDto } from 'src/dtos/chat-member.dto';
import { ChatInviteDto } from 'src/dtos/chat-invite.dto';
import { ChatMessageDto } from 'src/dtos/chat-message.dto';
import { ChatRestrictionDto } from 'src/dtos/chat-restriction.dto';
import { MatchDto } from 'src/dtos/match.dto';

@Injectable()
export class DatabaseService {
	constructor(
		// Users
		@InjectRepository(User)
		private readonly userRepository: Repository<UserDto>,
		@InjectRepository(FriendRequest)
		private readonly friendRequestRepository: Repository<FriendRequestDto>,

		// Chats
		@InjectRepository(Chat)
		private readonly chatRepository: Repository<ChatDto>,
		@InjectRepository(ChatMember)
		private readonly chatMemberRepository: Repository<ChatMemberDto>,
		@InjectRepository(ChatInvite)
		private readonly chatInviteRepository: Repository<ChatInviteDto>,
		@InjectRepository(ChatMessage)
		private readonly chatMessageRepository: Repository<ChatMessageDto>,
		@InjectRepository(ChatRestriction)
		private readonly chatRestrictionRepository: Repository<ChatRestrictionDto>,

		// Matches
		@InjectRepository(Match)
		private readonly matchRepository: Repository<MatchDto>,
	) { }
}
