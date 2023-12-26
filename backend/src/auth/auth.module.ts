import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service'

import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FortyTwoStrategy } from './strategies/fortytwo.strategy';
import { HttpModule } from '@nestjs/axios';
import { MatchesService } from 'src/matches/matches.service';
import { Match } from 'src/entities/match.entity';

@Module({
	imports: [UsersModule,
		HttpModule,
		PassportModule,
		JwtModule.registerAsync({
			useFactory: () => ({
				global: true,
				secret: process.env.JWT_SECRET,
				signOptions: { expiresIn: '1y' },
			}),
		}),
		TypeOrmModule.forFeature([User, Match]),
	],
	providers: [AuthService, JwtStrategy, FortyTwoStrategy, UsersService, MatchesService, QrCodeService],
	exports: [AuthService],
	controllers: [AuthController]
})
export class AuthModule { }
