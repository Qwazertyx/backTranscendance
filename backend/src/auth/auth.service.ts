import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService, sanitizeUser } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { LoginDto, RegisterDto } from 'src/dtos/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		@InjectRepository(User)
		private readonly user_repo: Repository<UserDto>
	) { }

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.user_repo.createQueryBuilder('user')
			.where('user.username = :username', { username })
			.getOne();

		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				return sanitizeUser(user);
			}
			return 'Mauvais mot de passe';
		}
		return 'Utilisateur inconnu';
	}

	async geUserBySchoolId(data: any) {
		const user = await this.user_repo.createQueryBuilder('user')
			.where('user.username = :username', { username: data.username })
			.getOne();
		if (user)
			return user;
		return undefined;
	}

	async register(data: Partial<UserDto>): Promise<any | undefined> {
		// Check if user exists
		const userExists = await this.user_repo.createQueryBuilder('user')
			.where('user.username = :username', { username: data.username })
			.getOne();
		if (userExists) {
			throw new HttpException(
				'Ce nom d\'utilisateur existe déjà',
				HttpStatus.FOUND
			);
		}
		const emailExists = await this.user_repo.createQueryBuilder('user')
			.where('user.email = :email', { email: data.email })
			.getOne();
		if (emailExists) {
			throw new HttpException(
				'Cet email existe déjà',
				HttpStatus.FOUND
			);
		}

		// Create user
		data.password = await bcrypt.hash(data.password, 12);
		const user = this.user_repo.create({
			username: data.username,
			email: data.email,
			password: data.password,
			displayname: data.username,
		});

		let prank = [
			'abollen', 'lezard', 'lizard', 'lézard', 'aurelien', 'aurélien'
		];

		if (user) {
			const entry = await this.user_repo.save(user);
			var avatar = 'default' + (entry.id % 10) + '.png';
			if (prank.includes(entry.username.toLowerCase()))
				avatar = 'prank.png';
			await this.user_repo.update(entry.id, { avatar: avatar });
			if (!entry) {
				throw new HttpException(
					'Utilisateur non créé',
					HttpStatus.INTERNAL_SERVER_ERROR
				);
			}
			return {
				message: 'User created successfully',
			};
		}
		else {
			throw new HttpException(
				'Utilisateur non créé',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async generateToken(user: UserDto): Promise<string> {
		const payload = { name: user.username, sub: user.id, email: user.email };
		return this.jwtService.sign(payload);
	}

	async login(data: Partial<UserDto>) {
		const user = await this.user_repo.createQueryBuilder('user')
			.where('user.username = :username', { username: data.username })
			.getOne();

		if (user) {
			if (await bcrypt.compare(data.password, user.password)) {
				return {
					message: 'Utilisateur connecté',
					token: await this.generateToken(user),
					id: user.id,
				};
			}
			throw new HttpException(
				'Mauvais mot de passe',
				HttpStatus.UNAUTHORIZED
			);
		}
		throw new HttpException(
			'Utilisateur inconnu',
			HttpStatus.NOT_FOUND
		);
	}

	async reconnect(id: number) {
		const user = await this.user_repo.createQueryBuilder('user')
			.where('user.id = :id', { id: id })
			.getOne();
		if (!user)
			throw new HttpException('Token Invalide', HttpStatus.UNAUTHORIZED);
		return user;
	}

}
