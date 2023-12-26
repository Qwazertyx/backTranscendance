import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequestDto } from 'src/dtos/friend-request.dto';
import { UserDto } from 'src/dtos/user.dto';
import { FriendRequest } from 'src/entities/friend-request.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(FriendRequest)
        private readonly friendsrepo: Repository<FriendRequestDto>,
        @InjectRepository(User)
        private readonly user_repo: Repository<UserDto>,
    ) { }

    async GetFriends(uid: number): Promise<UserDto[] | undefined> {
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        return this.user_repo.createQueryBuilder('user')
            .relation('friends')
            .of(user)
            .loadMany();
    }

    async AddFriend(uid: number, fid: number) {
        if (uid == fid)
            throw new HttpException('Impossible de s\'ajouter soi-même en ami', HttpStatus.BAD_REQUEST);
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        const friend = await this.user_repo.findOneBy({ id: fid });
        if (!friend)
            throw new HttpException('Utilisateur ciblé inconnu', HttpStatus.NOT_FOUND);
        const is_friend = await this.user_repo.createQueryBuilder('user')
            .innerJoinAndSelect('user.friends', 'friend')
            .where('user.id = :uid', { uid: uid })
            .andWhere('friend.id = :fid', { fid: fid })
            .getOne();
        const request_to = await this.friendsrepo.createQueryBuilder('friend_request')
            .where('friend_request.sender = :uid', { uid: uid })
            .andWhere('friend_request.receiver = :fid', { fid: fid })
            .getOne();
        if (is_friend || request_to)
            throw new HttpException('Vous êtes déjà ami avec l\'utilisateur', HttpStatus.OK);
        const request_from = await this.friendsrepo.createQueryBuilder('friend_request')
            .where('friend_request.sender = :fid', { fid: fid })
            .andWhere('friend_request.receiver = :uid', { uid: uid })
            .getOne();
        if (request_from) {
            await this.user_repo.createQueryBuilder('user')
                .relation('friends')
                .of(user)
                .add(friend);
            await this.user_repo.createQueryBuilder('user')
                .relation('friends')
                .of(friend)
                .add(user);
            await this.friendsrepo.delete({ id: request_from.id });
            return { message: 'Demande d\'ami acceptée', status: HttpStatus.OK };
        }
        const request = this.friendsrepo.create({ sender: user, receiver: friend });
        await this.friendsrepo.save(request);
        return { message: 'Demande d\'ami envoyée', status: HttpStatus.OK };
    }

    async RemoveFriend(uid: number, fid: number) {
        if (uid == fid)
            throw new HttpException('Impossible de se retirer de ses propres amis', HttpStatus.BAD_REQUEST);
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        const friend = await this.user_repo.findOneBy({ id: fid });
        if (!friend)
            throw new HttpException('Utilisateur ciblé inconnu', HttpStatus.NOT_FOUND);
        const is_friend = await this.user_repo.createQueryBuilder('user')
            .innerJoinAndSelect('user.friends', 'friend')
            .where('user.id = :uid', { uid: uid })
            .andWhere('friend.id = :fid', { fid: fid })
            .getOne();
        if (!is_friend)
            throw new HttpException('Vous n\'êtes pas ami avec l\'utilisateur ciblé', HttpStatus.OK);
        await this.user_repo.createQueryBuilder('user')
            .relation('friends')
            .of(user)
            .remove(friend);
        await this.user_repo.createQueryBuilder('user')
            .relation('friends')
            .of(friend)
            .remove(user);
        return { message: 'Ami retiré', status: HttpStatus.OK };
    }

    async GetFriendRequests(uid: number) {
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        return this.friendsrepo.createQueryBuilder('friend_request')
            .innerJoin('friend_request.sender', 'sender')
            .innerJoin('friend_request.receiver', 'receiver')
            .where('friend_request.receiver = :uid', { uid: uid })
            .addSelect(['friend_request.id', 'sender.id', 'sender.displayname', 'sender.username', 'receiver.id', 'receiver.displayname', 'receiver.username'])
            .getMany();
    }

    async GetSentFriendRequests(uid: number) {
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        return this.friendsrepo.createQueryBuilder('friend_request')
            .innerJoin('friend_request.sender', 'sender')
            .innerJoin('friend_request.receiver', 'receiver')
            .where('friend_request.sender = :uid', { uid: uid })
            .addSelect(['friend_request.id', 'sender.id', 'sender.displayname', 'sender.username', 'receiver.id', 'receiver.displayname', 'receiver.username'])
            .getMany();
    }

    async AcceptFriend(uid: number, id: number) {
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        const request = await this.friendsrepo.createQueryBuilder('friend_request')
            .leftJoinAndSelect('friend_request.sender', 'sender')
            .leftJoinAndSelect('friend_request.receiver', 'receiver')
            .where('friend_request.id = :id', { id: id })
            .getOne();
        if (!request)
            throw new HttpException('Demande d\'ami inexistante', HttpStatus.NOT_FOUND);
        console.log(request);
        if (request.receiver.id != uid)
            throw new HttpException('Cette demande d\'ami ne t\'es pas adréssée', HttpStatus.BAD_REQUEST);
        await this.user_repo.createQueryBuilder('user')
            .relation('friends')
            .of(user)
            .add(request.sender);
        await this.user_repo.createQueryBuilder('user')
            .relation('friends')
            .of(request.sender)
            .add(user);
        await this.friendsrepo.delete({ id: id });
        return { message: 'Demande d\'ami acceptée', status: HttpStatus.OK };
    }

    async DeclineFriend(uid: number, id: number) {
        const user = await this.user_repo.findOneBy({ id: uid });
        if (!user)
            throw new HttpException('Utilisateur inconnu', HttpStatus.NOT_FOUND);
        const request = await this.friendsrepo.createQueryBuilder('friend_request')
            .leftJoinAndSelect('friend_request.sender', 'sender')
            .leftJoinAndSelect('friend_request.receiver', 'receiver')
            .where('friend_request.id = :id', { id: id })
            .getOne();
        if (!request)
            throw new HttpException('Demande d\'ami inexistante', HttpStatus.NOT_FOUND);
        if (request.receiver.id != uid)
            throw new HttpException('Cette demande d\'ami ne t\'es pas adréssée', HttpStatus.BAD_REQUEST);
        await this.friendsrepo.delete({ id: id });
        return { message: 'Demande d\'ami refusée', status: HttpStatus.OK };
    }
}
