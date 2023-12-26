import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { User } from 'src/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Match, User]),
	],
	controllers: [MatchesController],
	providers: [MatchesService],
	exports: [MatchesService],
})
export class MatchesModule { }
