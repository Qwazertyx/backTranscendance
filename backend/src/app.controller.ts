import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { MatchesService } from './matches/matches.service';
import * as fs from 'fs';
import { Role } from './entities/user.entity';
import { AuthService } from './auth/auth.service';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { FriendsService } from './users/friends/friends.service';

@Controller()
@ApiExcludeController()
export class AppController {
	constructor(private readonly appService: AppService,
		private readonly usersService: UsersService,
		private readonly matchesService: MatchesService,
		private readonly friendsService: FriendsService,
		private readonly authService: AuthService) { }

	@Get('dummy')
	async init_dummy() {
		const jsonfile = fs.readFileSync('src/dummy.json', 'utf8');
		const dummyjson = JSON.parse(jsonfile);

		var users = [];

		for (const user of dummyjson.users) {

			try {
				const theuser = await this.usersService.FindOneByUsername(user.username);
				if (user) {
					theuser.elo = 1000;
					users.push(theuser);
					continue;
				}
				await this.authService.register(user);
				const new_user = await this.usersService.FindOneByUsername(user.username);
				await this.usersService.UpdateDisplayname(new_user, { displayname: user.displayname });
				new_user.elo = 1000;
				users.push(new_user);
			} catch (e) { }
		}

		// Initializing matches
		for (let i = 0; i < dummyjson.users.length * 10; i++) {
			let player1 = Math.floor(Math.random() * dummyjson.users.length);
			let player2 = Math.floor(Math.random() * (dummyjson.users.length - 1));
			if (player2 >= player1 && player2 < dummyjson.users.length - 1)
				player2 += 1;

			await this.matchesService.CreateMatch({
				player1: users[player1],
				player2: users[player2],
				result: Math.floor(Math.random() * 3),
				player1Score: Math.floor(Math.random() * 7),
				player2Score: Math.floor(Math.random() * 7),
				duration: Math.floor(Math.random() * 300),
				map: 'de_dust2'
			});
		}
		// Initializing friends
		for (const user of dummyjson.users) {
			const u = await this.usersService.FindOneByUsername(user.username);
			for (const friend of user.friends) {
				try {
					const f = await this.usersService.FindOneByUsername(friend);
					await this.friendsService.AddFriend(u.id, f.id);
					await this.friendsService.AddFriend(f.id, u.id);
				}
				catch (e) { }
			}

			for (const request of user.requests) {
				try {
					const r = await this.usersService.FindOneByUsername(request);
					await this.friendsService.AddFriend(u.id, r.id);
				}
				catch (e) { }
			}
		}
	}

	@Get('admin/:id')
	async admin(@Param('id') id: number) {
		let user = await this.usersService.FindOneById(id);
		if (!user)
			return new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
		user.role = Role.ADMIN;
		await this.usersService.Update(id, user);
		return await this.authService.generateToken(user);
	}

	@Get('hello')
	async hello() {
		console.log('hello');
		return "Hello World!";
	}

}
