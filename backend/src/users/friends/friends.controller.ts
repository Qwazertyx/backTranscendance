import { Controller, Delete, Get, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersController } from '../users.controller';
import { GenericUserDto } from 'src/dtos/user.dto';
import { FriendRequestDto, FriendRequestSwagger } from 'src/dtos/friend-request.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiTags('Friends')
@Controller('/friends')
export class FriendsController {
    constructor(private readonly service: FriendsService) { }

    @ApiOperation({ summary: 'List a user\'s friends' })
    @ApiOkResponse({ description: 'List of friends', type: GenericUserDto, isArray: true })
    @Get()
    async GetFriends(@Request() req: any) {
        console.log("FriendsController GetFriends:" + req.user.id);
        return UsersController.GeneralizeUsers(await this.service.GetFriends(req.user.id));
    }

    @ApiOperation({ summary: 'Send a friend request', description: 'If the user has already sent you a friend request, you will automatically become friends. If you are already friends with them, does nothing' })
    @ApiOkResponse({ description: 'Friend request sent or accepted' })
    @ApiBadRequestResponse({ description: 'You cannot add yourself as a friend' })
    @ApiNotFoundResponse({ description: 'User or friend not found' })
    @Post(':friend_id')
    async AddFriend(@Request() req: any, @Param('friend_id') friend_id: number) {
        console.log("FFFFF");
        return this.service.AddFriend(req.user.id, friend_id);
    }


    @ApiOperation({ summary: 'Remove a friend from a user', description: 'If you are not friends with them, does nothing' })
    @ApiOkResponse({ description: 'Friend removed' })
    @ApiNotFoundResponse({ description: 'User or friend not found' })
    @ApiBadRequestResponse({ description: 'You cannot unfriend yourself' })
    @Delete(':friend_id')
    async RemoveFriend(@Param('friend_id') friend_id: number, @Request() req: any) {
        return this.service.RemoveFriend(req.user.id, friend_id);
    }

    @ApiOperation({ summary: 'List a user\'s friend requests' })
    @ApiOkResponse({ description: 'List of friend requests', schema: { example: [FriendRequestSwagger] } })
    @ApiNotFoundResponse({ description: 'Utilisateur inconnu' })
    @Get('/requests')
    async GetFriendRequests(@Request() req: any) {
        return this.service.GetFriendRequests(req.user.id);
    }

    @ApiOperation({ summary: 'List a user\'s sent friend requests' })
    @ApiOkResponse({ description: 'List of sent friend requests', schema: { example: [FriendRequestSwagger] } })
    @ApiNotFoundResponse({ description: 'Utilisateur inconnu' })
    @Get('/requests/sent')
    async GetSentFriendRequests(@Request() req: any) {
        return this.service.GetSentFriendRequests(req.user.id);
    }

    @ApiOperation({ summary: 'Accept a friend request' })
    @ApiOkResponse({ description: 'Friend request accepted' })
    @ApiNotFoundResponse({ description: 'User or request not found' })
    @ApiBadRequestResponse({ description: 'User is not the receiver of this friend request' })
    @Post('/requests/:request_id/accept')
    async AcceptFriend(@Param('request_id') request_id: number, @Request() req: any) {
        return this.service.AcceptFriend(req.user.id, request_id);
    }

    @ApiOperation({ summary: 'Decline a friend request' })
    @ApiOkResponse({ description: 'Friend request accepted' })
    @ApiNotFoundResponse({ description: 'User or request not found' })
    @ApiBadRequestResponse({ description: 'User is not the receiver of this friend request' })
    @Post('/requests/:request_id/decline')
    async DeclineFriend(@Param('request_id') request_id: number, @Request() req: any) {
        return this.service.DeclineFriend(req.user.id, request_id);
    }
}
