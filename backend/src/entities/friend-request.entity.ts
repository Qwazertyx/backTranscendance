import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

// Entities
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class FriendRequest extends BaseEntity {
	@ManyToOne(() => User, user => user.sentFriendRequests, {
		onDelete: 'CASCADE', eager: false, nullable: false
	})
	sender: User;

	@ManyToOne(() => User, user => user.receivedFriendRequests, {
		onDelete: 'CASCADE', eager: false, nullable: false
	})
	receiver: User;
}