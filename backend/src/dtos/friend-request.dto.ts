import { User } from "../entities/user.entity";
import { UserDto } from "./user.dto";

export interface FriendRequestDto {
	id: number;

	sender: UserDto;
	receiver: UserDto;

	created_at: Date;
	updated_at: Date;
}

export const FriendRequestSwagger = {
	id: 2,

	sender: {
		id: 1,
		username: 'john',
		displayname: 'John Doe'
	},
	receiver: {
		id: 2,
		username: 'steve',
		displayname: 'Steve Smith'
	},

	created_at: new Date(Date.now() - (1000 * 60 * 60 * 24)),
	updated_at: new Date()
}