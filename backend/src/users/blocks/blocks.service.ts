import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlocksService {
    constructor(
        @InjectRepository(User)
        private readonly user_repo: Repository<UserDto>,
    ) { }

    async GetBlockedUsers(uid: number): Promise<UserDto[] | undefined> {
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        console.log(user);
        return this.user_repo.createQueryBuilder('user')
            .relation('blockedUsers')
            .of(user)
            .loadMany();
    }

    async GetBlockedByUsers(uid: number): Promise<UserDto[] | undefined> {
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        return this.user_repo.createQueryBuilder('user')
            .relation('blockedBy')
            .of(user)
            .loadMany();
    }

    async BlockUser(uid: number, bid: number) {
        if (uid == bid)
            throw new HttpException('Impossible de se bloquer soi-même', HttpStatus.BAD_REQUEST);
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        const blocked = await this.user_repo.findOneBy({ id: bid });
        if (!blocked)
            throw new HttpException('Utilisateur visé est inconnu', HttpStatus.NOT_FOUND);
        const is_blocked = await this.user_repo.createQueryBuilder('user')
            .innerJoinAndSelect('user.blockedUsers', 'blockedUser')
            .where('user.id = :uid', { uid: uid })
            .andWhere('blockedUser.id = :bid', { bid: bid })
            .getOne();
        if (is_blocked)
            throw new HttpException('Cet utilisateur est déjà bloqué', HttpStatus.OK);
        const is_blocked_by = await this.user_repo.createQueryBuilder('user')
            .innerJoinAndSelect('user.blockedBy', 'blockedBy')
            .where('user.id = :bid', { bid: bid })
            .andWhere('blockedBy.id = :uid', { uid: uid })
            .getOne();
        await this.user_repo.createQueryBuilder('user')
            .relation('blockedUsers')
            .of(user)
            .add(blocked);
        await this.user_repo.createQueryBuilder('user')
            .relation('friends')
            .of(user)
            .remove(blocked);

        return { message: 'User blocked' };
    }

    async UnblockUser(uid: number, bid: number) {
        if (uid == bid)
            throw new HttpException('Impossible de se débloquer soi-même', HttpStatus.BAD_REQUEST);
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        const unblocked = await this.user_repo.findOneBy({ id: bid });
        if (!unblocked)
            throw new HttpException('Utilisateur ciblé inconnu', HttpStatus.NOT_FOUND);
        await this.user_repo.createQueryBuilder('user')
            .relation('blockedUsers')
            .of(user)
            .remove(unblocked);
        await this.user_repo.createQueryBuilder('user')
            .relation('blockedBy')
            .of(unblocked)
            .remove(user);
        return { message: 'Utilisateur débloqué' };
    }
}
