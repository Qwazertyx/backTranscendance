import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MatchesModule } from './matches/matches.module';
import { ChatsModule } from './chats/chats.module';
import { AvatarsModule } from './avatars/avatars.module';
import { FriendsModule } from './users/friends/friends.module';
import { BlocksModule } from './users/blocks/blocks.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';


@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, }),
		DatabaseModule,
		FriendsModule,
		BlocksModule,
		UsersModule,
		AvatarsModule,
		LeaderboardModule,
		AuthModule,
		MatchesModule,
		ChatsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
