import { Controller, Get, Post, UseGuards, Request, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { sanitizeUser } from 'src/users/users.service';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto, TokenDto } from 'src/dtos/auth.dto';
import { DetailedUserDto, UserDto } from 'src/dtos/user.dto';
import { FortyTwoAuthGuard } from './guards/fortytwo-oauth.guard';
import { MatchesService } from 'src/matches/matches.service';

import { QrCodeService } from './qr-code.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly service: AuthService,
		private readonly matchesService: MatchesService,
		private readonly qrCodeService: QrCodeService,
	) { }

	@ApiOperation({ summary: 'Authenticate a user' })
	@ApiOkResponse({ description: 'User authenticated', type: TokenDto })
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Wrong credentials' })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Utilisateur inconnu' })
	@Post('login')
	login(@Body() data: Partial<UserDto>): any {
		console.log("AuthController login:" + data);
		return this.service.login(data);
	}

	@ApiOperation({ summary: 'Register a user' })
	@ApiOkResponse({ description: 'User registered' })
	@ApiResponse({ status: HttpStatus.FOUND, description: 'User or email already registered' })
	@Post('register')
	register(@Body() data: RegisterDto): any {
		const newUser = this.service.register(data)
		this.matchesService.RankPlayers();
		return newUser;
	}

	@ApiOperation({ summary: 'Get the current user' })
	@ApiOkResponse({ description: 'User found', type: DetailedUserDto })
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid Token' })
	@UseGuards(JwtAuthGuard)
	@Get('reconnect')
	reconnect(@Request() req: any) {
		return sanitizeUser(this.service.reconnect(req.user.id));
	}
	
	@ApiOperation({ summary: 'Request QR code for 2FA' })
	@ApiOkResponse({ description: 'QR code generated successfully', type: String })
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid Token' })
	@UseGuards(JwtAuthGuard)
	@Get('qr-code')
	requestQrCode(@Request() req: any): Promise<string> {
		const userId = req.user.id;
		return this.qrCodeService.generateQrCode(userId);
	}

	@ApiOperation({ summary: 'Verify QR code for 2FA' })
	@ApiResponse({ status: HttpStatus.OK, description: 'QR code verified successfully', type: String })
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid Token' })
	@UseGuards(JwtAuthGuard)
	@Post('qr-code/verify')
	verifyQrCode(@Request() req: any, @Body() data: { code: string }): Promise<string> {
		const userId = req.user.id;
		return this.qrCodeService.verifyQrCode(userId, data.code);
	}
}