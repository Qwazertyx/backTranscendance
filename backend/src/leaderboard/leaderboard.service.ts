import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LeaderboardService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<UserDto>
    ) {
        this.repo = repo;
    }

    async GetLeaderboard() {
        return this.repo.createQueryBuilder('user')
            .orderBy('user.elo', 'DESC')
            .getMany();
    }
}
