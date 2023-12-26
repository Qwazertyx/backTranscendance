import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars.controller';
import { AvatarsService } from './avatars.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
	],
	controllers: [AvatarsController],
	providers: [AvatarsService, UsersService]
})
export class AvatarsModule { }
