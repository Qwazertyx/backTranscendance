import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity'
import { MulterModule } from '@nestjs/platform-express';
import { FriendsModule } from './friends/friends.module';
import { BlocksModule } from './blocks/blocks.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		MulterModule.register({
			dest: './data/avatars',
		}),
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule { }
