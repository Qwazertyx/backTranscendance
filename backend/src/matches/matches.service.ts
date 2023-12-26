import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto, MatchDto } from 'src/dtos/match.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class MatchesService {
	constructor(
		@InjectRepository(Match)
		private readonly repo: Repository<MatchDto>,
		@InjectRepository(User)
		private readonly userRepo: Repository<User>
	) {
		this.repo = repo;
	}

	async GetMatches(pagination: { page: number, limit: number }): Promise<Partial<MatchDto>[]> {
		return this.repo.createQueryBuilder('match')
			.leftJoin('match.player1', 'player1')
			.leftJoin('match.player2', 'player2')
			.orderBy('match.created_at', 'DESC')
			.skip((pagination.page - 1) * pagination.limit)
			.take(pagination.limit)
			.addSelect(['player1.id', 'player1.username', 'player1.displayname'])
			.addSelect(['player2.id', 'player2.username', 'player2.displayname'])
			.getMany();
	}

	async GetMatchById(id: number) {
		return this.repo.createQueryBuilder('match')
			.leftJoin('match.player1', 'player1')
			.leftJoin('match.player2', 'player2')
			.where('match.id = :id', { id: id })
			.addSelect(['player1.id', 'player1.username', 'player1.displayname'])
			.addSelect(['player2.id', 'player2.username', 'player2.displayname'])
			.getOne();
	}

	async GetMatchesByUser(uid: number, pagination: { page: number, limit: number }) {
		return this.repo.createQueryBuilder('match')
			.leftJoin('match.player1', 'player1')
			.leftJoin('match.player2', 'player2')
			.where('match.player1 = :uid OR match.player2 = :uid', { uid: uid })
			.orderBy('match.created_at', 'DESC')
			.skip((pagination.page - 1) * pagination.limit)
			.take(pagination.limit)
			.addSelect(['player1.id', 'player1.username', 'player1.displayname'])
			.addSelect(['player2.id', 'player2.username', 'player2.displayname'])
			.getMany();
	}

	async RankPlayers() {
		const players = await this.userRepo.createQueryBuilder('user')
			.orderBy('user.elo', 'DESC')
			.getMany();

		for (const user of players) {
			user.rank = players.indexOf(user) + 1;
			await this.userRepo.update({ id: user.id }, user);
		}
	}



	async CreateMatch(data: Partial<MatchDto>) {
		const player1 = await this.userRepo.findOneBy({ id: data.player1.id });
		const player2 = await this.userRepo.findOneBy({ id: data.player2.id });

		if (!player1 || !player2) {
			throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
		}

		player1.matchesCount += 1;
		player2.matchesCount += 1;

		const r1 = (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (player2.elo - player1.elo) / 400));
		const r2 = (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (player1.elo - player2.elo) / 400));

		const K = 50;

		switch (data.result) {
			case 1:
				player1.elo = Math.round(player1.elo + K * (1 - r1));
				player2.elo = Math.round(player2.elo + K * (0 - r2));
				player1.winCount += 1;
				player2.lossCount += 1;
				break;
			case 2:
				player1.elo = Math.round(player1.elo + K * (0 - r1));
				player2.elo = Math.round(player2.elo + K * (1 - r2));
				player1.lossCount += 1;
				player2.winCount += 1;
				break;
			default:
				player1.elo = Math.round(player1.elo + K * (0.5 - r1));
				player2.elo = Math.round(player2.elo + K * (0.5 - r2));
				player1.drawCount += 1;
				player2.drawCount += 1;
				break;
		}

		await this.userRepo.save(player1);
		await this.userRepo.save(player2);
		await this.RankPlayers();

		const entry = this.repo.create(data);
		return this.repo.save(entry);
	}
}
