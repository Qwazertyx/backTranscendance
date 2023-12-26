import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm'
import { UpdateUserDisplaynameDto, UpdateUserEmailDto, UpdateUserPasswordDto, UserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from 'src/dtos/auth.dto';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

export type UserType = {
	id: number;
	name: string;
	username: string;
	password: string;
};

export async function sanitizeUser(user: UserDto): Promise<any>;
export async function sanitizeUser(user: Promise<UserDto>): Promise<any>;
export async function sanitizeUser(user: any): Promise<any> {
	if (user instanceof Promise) {
		user = await user;
	}
	const { password, secret, ...rest } = user;
	return rest;
}

export async function sanitizeUsers(users: UserDto[]): Promise<UserDto[]>;
export async function sanitizeUsers(users: Promise<UserDto[]>): Promise<UserDto[]>;
export async function sanitizeUsers(users: any): Promise<UserDto[]> {
	if (users instanceof Promise) {
		users = await users;
	}
	for (let i = 0; i < users.length; i++) {
		users[i] = await sanitizeUser(users[i]);
	}
	return users;
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly repo: Repository<UserDto>,
	) { }

	async Create(data: UserDto | RegisterDto): Promise<UserDto | undefined> {
		const entry = this.repo.create(data);
		return await this.repo.save(entry);
	}

	async FindAll(): Promise<UserDto[] | undefined> {
		const users = await this.repo.find();
		return users;
	}

	async FindOneById(id: number): Promise<UserDto | undefined> {
		return this.repo.findOneBy({ id: id });
	}

	async FindOneByUsername(username: string): Promise<UserDto | undefined> {
		return this.repo.findOneBy({ username: username });
	}

	async FindOneByEmail(email: string): Promise<UserDto | undefined> {
		return await this.repo.findOneBy({ email: email });
	}

	async FindOneByDisplayname(displayname: string): Promise<UserDto | undefined> {
		return this.repo.findOneBy({ displayname: displayname });
	}

	async FindOneBySchoolId(schoolId: string): Promise<UserDto | undefined> {
		return this.repo.findOneBy({ schoolId: schoolId });
	}

	async Update(id: number, data: UserDto): Promise<UpdateResult | undefined> {
		return this.repo.update({ id: id }, data);
	}

	async Remove(id: number): Promise<DeleteResult | undefined> {
		return this.repo.delete({ id: id });
	}

	async Search(field: string): Promise<UserDto[] | undefined> {
		return await this.repo.find({ where: [{ username: field }, { displayname: field }] });
	}

	// Update specific fields
	async UpdatePassword(user: UserDto, data: UpdateUserPasswordDto): Promise<UpdateResult | undefined> {
		const passwordMatches = await bcrypt.compare(data.oldPassword, user.password);
		if (!passwordMatches)
			throw new HttpException('Mot de passe incorrecte', HttpStatus.UNAUTHORIZED);
		return this.repo.update({ id: user.id }, { password: await bcrypt.hash(data.newPassword, 12) });
	}

	async UpdateDisplayname(user: UserDto, data: UpdateUserDisplaynameDto): Promise<UpdateResult | undefined> {
		return this.repo.update({ id: user.id }, { displayname: data.displayname });
	}

	async UpdateAvatar(user: UserDto, file: Express.Multer.File): Promise<UpdateResult | undefined> {
		if (fs.existsSync('./data/avatars/' + user.id))
			fs.unlinkSync('./data/avatars/' + user.id);
		fs.renameSync('./data/avatars/' + file.filename, './data/avatars/' + user.id);
		return this.repo.update({ id: user.id }, { avatar: file.filename, avatarMimeType: file.mimetype });
	}

	async GetAvatar(uid: number, res: any) {
		const user = await this.repo.findOneBy({ id: uid })
		const path = './data/avatars/';
		if (!user)
			throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
		if (fs.existsSync(path + uid)) {
			const file = await fs.promises.readFile(path + uid);
			res.header('Content-Type', 'image/png');
			res.send(file);
		}
		else if (fs.existsSync(path + user.avatar)) {
			const file = await fs.promises.readFile(path + user.avatar);
			res.header('Content-Type', 'image/png');
			res.send(file);
		}
		else
			throw new HttpException('Avatar inexistant', HttpStatus.NOT_FOUND);
	}

	async UpdateEmail(user: UserDto, data: UpdateUserEmailDto): Promise<UpdateResult | undefined> {
		return this.repo.update({ id: user.id }, { email: data.email });
	}

	async FuzzySearch(field: string): Promise<UserDto | undefined> {
		const users = await this.FindAll();
		const lower_field = field.toLowerCase();
		const promises: Promise<number>[] = [];
		for (let i = 0; i < users.length; i++) {
			promises.push(this.OsaDistance(lower_field, users[i].username.toLowerCase()));
			promises.push(this.OsaDistance(lower_field, users[i].displayname.toLowerCase()));
		}
		const results = await Promise.all(promises);
		var best: number = Number.MAX_SAFE_INTEGER;
		var best_index = 0;
		const req = lower_field.length > 5 ? 3 : lower_field.length - 2;
		for (let i = 0; i < results.length; i++) {
			if (results[i] < best) {
				best = results[i];
				best_index = i;
			}
		}
		if (best >= 10)
			return undefined;
		return users[best_index / 2];
	}

	async OsaDistance(a: string, b: string): Promise<number> {
		var matrix: number[][] = [];
		for (let i = 0; i <= a.length; i++) {
			matrix[i] = [];
			matrix[i][0] = i;
		}
		for (let j = 0; j <= b.length; j++) {
			matrix[0][j] = j;
		}

		for (let i = 1; i <= a.length; i++) {
			for (let j = 1; j <= b.length; j++) {
				const deletion = matrix[i - 1][j] + 1;
				const insertion = matrix[i][j - 1] + 1;
				const substitution = matrix[i - 1][j - 1] + ((a[i] == b[j]) ? 0 : 1);
				var distance = Math.min(deletion, insertion, substitution);
				if (i > 1 && j > 1 && a[i] == b[j - 1] && a[i - 1] == b[j])
					distance = Math.min(distance, matrix[i - 2][j - 2] + 1)
				matrix[i][j] = distance;
			}
		}
		return matrix[a.length][b.length];
	}
}
