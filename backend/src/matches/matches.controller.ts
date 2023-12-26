import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMatchDto, MatchDto, MatchSwagger } from 'src/dtos/match.dto';
import { Match } from 'src/entities/match.entity';

const PAGE_LIMIT = 100;

@Controller('matches')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MatchesController {
	constructor(private readonly service: MatchesService) { }

	@UseInterceptors(ClassSerializerInterceptor)
	@ApiOperation({ summary: 'Get recent matches' })
	@ApiOkResponse({ description: 'Matches found', schema: { example: [MatchSwagger] } })
	@Get()
	@Get('/page:page')
	async FindMatches(@Param('page') page: number = 1) {
		return this.service.GetMatches({ page: page, limit: PAGE_LIMIT });
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@ApiOperation({ summary: 'Get a match by its id' })
	@ApiOkResponse({ description: 'Match found', schema: { example: MatchSwagger } })
	@ApiResponse({ status: 404, description: 'Match not found' })
	@Get(':match_id')
	async FindMatchById(@Param('match_id') match_id: number) {
		return this.service.GetMatchById(match_id);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@ApiOperation({ summary: 'Get a user\'s recent matches' })
	@ApiResponse({ status: 404, description: 'Utilisateur inconnu' })
	@ApiOkResponse({ description: 'Matches found', isArray: true, schema: { example: [MatchSwagger] } })
	@Get('user/:user_id')
	@Get('user/:user_id/:page')
	async FindMatchesByUser(@Param('user_id') user_id: number, @Param('page') page: number = 1) {
		return this.service.GetMatchesByUser(user_id, { page: page, limit: PAGE_LIMIT });
	}

	@ApiOperation({ summary: 'Create a new match between two players' })
	@ApiOkResponse({ description: 'Match created', type: Match })
	@ApiResponse({ status: 404, description: 'Utilisateur inconnu' })
	@Post()
	async CreateMatch(@Body() data: MatchDto) {
		return this.service.CreateMatch(data);
	}
}
