import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LeaderboardService } from './leaderboard.service';
import { UsersController } from 'src/users/users.controller';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/dtos/user.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) { }

    public GeneralizeUsers(users: UserDto[]) {
        const result: Partial<UserDto>[] = [];
        for (let i = 0; i < users.length; i++) {
            const user = {
                id: users[i].id,
                username: users[i].username,
                displayname: users[i].displayname,
                avatar: users[i].avatar,
                rank: users[i].rank,
                elo: users[i].elo
            };
            result.push(user);
        }
        return result;
    }

    @ApiOperation({ summary: 'Get the leaderboard' })
    @ApiResponse({ status: 200, description: 'Leaderboard found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Get()
    async GetLeaderboard() {
        return this.GeneralizeUsers(await this.leaderboardService.GetLeaderboard());
    }
}
