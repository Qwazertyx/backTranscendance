import { Entity, Column, ManyToOne } from 'typeorm';

// Entities
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Match extends BaseEntity {
	// Users
	@ManyToOne(() => User, user => user.matchesAsP1, { onDelete: 'SET NULL' })
	player1: User;
	@Column({ type: 'int', nullable: false, default: 0 })
	player1Score: number;

	@ManyToOne(() => User, user => user.matchesAsP2, { onDelete: 'SET NULL' })
	player2: User;
	@Column({ type: 'int', nullable: false, default: 0 })
	player2Score: number;

	// Match info
	@Column({ type: 'varchar', nullable: false, length: 50, default: 'default' })
	map: string;

	@Column({ type: 'int', nullable: false, default: 3 })
	result: number;

	@Column({ type: 'int' })
	duration: number;
}