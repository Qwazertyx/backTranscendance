import { Controller, Get, HttpException, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('avatars')
@ApiTags('Avatars')
export class AvatarsController {
	constructor(private readonly usersService: UsersService) { }

	@ApiOperation({ summary: 'Get a user\'s avatar' })
	@ApiProduces('image/png', 'image/jpg')
	@ApiOkResponse({ description: 'Avatar found', type: 'image/png' })
	@Get(':user_id')
	async FindAvatar(@Param('user_id') user_id: number, @Res() res: Response) {
		const user = await this.usersService.FindOneById(user_id);
		const path = './data/avatars/';
		if (!user)
			throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
		if (fs.existsSync(path + user_id)) {
			const file = await fs.promises.readFile(path + user_id);
			res.header('Content-Type', 'image/png');
			res.send(file);
		}
		else if (fs.existsSync(path + user.avatar)) {
			const file = await fs.promises.readFile(path + user.avatar);
			res.header('Content-Type', 'image/png');
			res.send(file);
		}
		else if (fs.existsSync(path + "default" + (user_id % 10) + ".png")) {
			const file = await fs.promises.readFile(path + "default" + (user_id % 10) + ".png");
			res.header('Content-Type', 'image/png');
			res.send(file);
		}
		else
			throw new HttpException('Avatar inexistant', HttpStatus.NOT_FOUND);
	}
}
