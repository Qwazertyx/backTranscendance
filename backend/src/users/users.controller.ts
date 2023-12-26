import { Controller, Get, Body, Param, Delete, UseGuards, HttpException, HttpStatus, Put, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Request, Req, Res } from '@nestjs/common';

import { UsersService, sanitizeUser } from './users.service';
import { DetailedUserDto, GenericUserDto, UpdateUserDisplaynameDto, UpdateUserEmailDto, UpdateUserPasswordDto, UserDto } from 'src/dtos/user.dto'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly service: UsersService) { }

	public static GeneralizeUser(user: UserDto): GenericUserDto {
		const { id, username, displayname, avatar } = user;
		return { id, username, displayname, avatar };
	}

	public static GeneralizeUsers(users: UserDto[]): GenericUserDto[] {
		const result: GenericUserDto[] = [];
		for (let i = 0; i < users.length; i++) {
			result.push(UsersController.GeneralizeUser(users[i]));
		}
		return result;
	}

	@ApiOperation({ summary: 'List every existing users' })
	@ApiOkResponse({ description: 'All users', type: GenericUserDto, isArray: true })
	@Get()
	async findAll() {
		return UsersController.GeneralizeUsers(await this.service.FindAll());
	}

	@ApiOperation({ summary: 'Search for a user, returns closest match' })
	@ApiOkResponse({ description: 'User found', type: DetailedUserDto })
	@ApiResponse({ status: 404, description: 'Utilisateur inconnu' })
	@Get('search/:field')
	async search(@Param('field') field: string) {
		if (!field || field.length < 1)
			return new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
		const user = await this.service.FuzzySearch(field);
		if (!user)
			return new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
		return UsersController.GeneralizeUser(user);
	}

	@ApiOperation({ summary: 'Get detailed info about a user' })
	@ApiOkResponse({ description: 'User found', type: DetailedUserDto })
	@ApiResponse({ status: 404, description: 'Utilisateur inconnu' })
	@Get(':user_id')
	async FindOneById(@Param('user_id') id: number = 0) {
		if (!id || id <= 0)
			return new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
		const user = await this.service.FindOneById(id)
		if (!user)
			return new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
		return sanitizeUser(user);
	}

	@ApiOperation({ summary: 'Delete a user and its associated data', description: 'This action is irreversible, uses the jwt token to identify target' })
	@ApiOkResponse({ description: 'User deleted' })
	@ApiResponse({ status: 404, description: 'Utilisateur inconnu' })
	@Delete()
	async DeleteUser(@Request() req: any) {
		return await this.service.Remove(req.user.id);
	}

	@ApiOperation({ summary: 'Update a user\'s password', description: 'Restricted to the target user, uses the jwt token to identify target' })
	@ApiOkResponse({ description: 'Password updated' })
	@ApiResponse({ status: 404, description: 'Utilisateur inconnu' })
	@ApiBody({ type: UpdateUserPasswordDto })
	@Put('password')
	async UpdatePassword(@Body() data: UpdateUserPasswordDto, @Request() req: any) {
		return await this.service.UpdatePassword(req.user, data);
	}

	@ApiOperation({ summary: 'Update a user\'s email', description: 'Restricted to the target user, uses the jwt token to identify target' })
	@ApiOkResponse({ description: 'Email updated' })
	@ApiResponse({ status: 404, description: 'Utilisateur inconnu' })
	@ApiResponse({ status: 400, description: 'Email already used' })
	@ApiBody({ type: UpdateUserEmailDto })
	@Put('email')
	async UpdateEmail(@Body() data: UserDto, @Request() req: any) {
		return await this.service.UpdateEmail(req.user, data);
	}

	@ApiOperation({ summary: 'Update a user\'s displayname', description: 'Restricted to the target user, uses the jwt token to identify target' })
	@ApiOkResponse({ description: 'Displayname updated' })
	@ApiResponse({ status: 404, description: 'Utilisateur inconnu' })
	@ApiResponse({ status: 400, description: 'Displayname already taken' })
	@ApiBody({ type: UpdateUserDisplaynameDto })
	@Put('displayname')
	async UpdateDisplayname(@Body() data: UpdateUserDisplaynameDto, @Request() req: any) {
		return await this.service.UpdateDisplayname(req.user, data);
	}

	@ApiOperation({ summary: 'Get a user\'s avatar' })
	@ApiOkResponse({ description: 'Avatar found' })
	@ApiResponse({ status: 404, description: 'Utilisateur inconnu' })
	@ApiResponse({ status: 404, description: 'Avatar not found' })
	@Get(':user_id/avatar')
	async GetAvatar(@Param('user_id') id: number, @Res() res: Response) {
		return await this.service.GetAvatar(id, res);
	}

	@ApiOperation({ summary: 'Update a user\'s avatar', description: 'Restricted to the target user, accepts files as multipart/form-data, image field must be called \'avatar\', uses the jwt token to identify target' })
	@ApiConsumes("image/jpeg", "image/png", "image/jpg")
	@ApiOkResponse({ description: 'Avatar updated' })
	@ApiResponse({ status: 404, description: 'Utilisateur inconnu' })
	@ApiResponse({ status: 400, description: 'Invalid file' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				avatar: {
					type: 'string',
					format: 'multipart/form-data',
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor('avatar'))
	@Put('avatar')
	async updateAvatar(@Request() req: any, @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 5000000 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),], }),)
	avatar: Express.Multer.File) {
		return await this.service.UpdateAvatar(req.user, avatar);
	}
}
