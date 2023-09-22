import { Injectable } from '@nestjs/common';

export type User = {
	id: number;
	name: string;
	username: string;
	password: string;
};



@Injectable()
export class UsersService {
	private readonly users: User[] = [
		{
			id: 1,
			name: 'Victor',
			username: 'vsedat',
			password: 'passvsedat',
		},
		{
			id: 2,
			name: 'Victor2',
			username: 'vsedat2',
			password: 'passvsedat2',
		},
	];

	async findOne(username: string) :Promise<User | undefined> {
		return this.users.find(user => user.username === username);
	}
}
