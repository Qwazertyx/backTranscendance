import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { FriendRequest } from 'src/entities/friend-request.entity';
import { Chat } from 'src/entities/chat.entity';
import { ChatMember } from 'src/entities/chat-member.entity';
import { ChatInvite } from 'src/entities/chat-invite.entity';
import { ChatMessage } from 'src/entities/chat-message.entity';
import { ChatRestriction } from 'src/entities/chat-restriction.entity';
import { Match } from 'src/entities/match.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, }),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: parseInt(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DATABASE,
			autoLoadEntities: true,
			synchronize: true,
		}),
		TypeOrmModule.forFeature([User, FriendRequest, Chat, ChatMember, ChatInvite, ChatMessage, ChatRestriction, Match]),
	],
	providers: [DatabaseService]
})
export class DatabaseModule { }
