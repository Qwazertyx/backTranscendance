import { User } from '../entities/user.entity';

export interface MatchDto {
	id: number;

	// Users
	player1: Partial<User>;
	player2: Partial<User>;

	// Match info
	map: string;
	result: number;
	player1Score: number;
	player2Score: number;
	duration: number;

	created_at: Date;
	updated_at: Date;
}

export const MatchSwagger = {
	id: 1,
	player1: {
		id: 1,
		username: 'john',
		displayname: 'John Doe',
	},
	player2: {
		id: 2,
		username: 'steve',
		displayname: 'Steve Smith',
	},
	map: 'de_dust2',
	player1Score: 7,
	player2Score: 5,
	result: 1,
	duration: 120,
	created_at: new Date(Date.now() - (1000 * 60 * 60 * 24)),
	updated_at: new Date()
}

export class CreateMatchDto {
	player1: User;
	player2: User;
	map: string;
	result: number;
	player1Score: number;
	player2Score: number;
	duration: number;
}