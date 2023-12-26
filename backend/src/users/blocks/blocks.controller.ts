import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BlocksService } from './blocks.service';
import { GenericUserDto } from 'src/dtos/user.dto';
import { UsersController } from '../users.controller';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiTags('Blocks')
@Controller('users/blocks')
export class BlocksController {
    constructor(private readonly service: BlocksService) { }

    @ApiOperation({ summary: 'List a user\'s blocked users' })
    @ApiOkResponse({ description: 'List of blocked users', type: GenericUserDto, isArray: true })
    @ApiNotFoundResponse({ description: 'User or target not found' })
    @Get()
    async GetBlockedUsers(@Request() req: any) {
        return UsersController.GeneralizeUsers(await this.service.GetBlockedUsers(req.user.id));
    }

    @ApiOperation({ summary: 'List a user\'s blocked by users' })
    @ApiOkResponse({ description: 'List of blocked by users', type: GenericUserDto, isArray: true })
    @ApiNotFoundResponse({ description: 'User or target not found' })
    @Get('/by')
    async GetBlockedByUsers(@Request() req: any) {
        return UsersController.GeneralizeUsers(await this.service.GetBlockedByUsers(req.user.id));
    }

    @Post(':target_id')
    @ApiOkResponse({ description: 'User blocked' })
    @ApiNotFoundResponse({ description: 'User or target not found' })
    async BlockUser(@Request() req: any, @Param('target_id') bid: number) {
        return this.service.BlockUser(req.user.id, bid);
    }

    @Delete(':target_id')
    @ApiOkResponse({ description: 'User blocked' })
    @ApiNotFoundResponse({ description: 'User or target not found' })
    async UnblockUser(@Request() req: any, @Param('target_id') bid: number) {
        return this.service.UnblockUser(req.user.id, bid);
    }
}
