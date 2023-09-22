import { Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthenticatedGuard } from './auth/authenticated.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return {msg: 'Logged in!'}; //todo: return JWT access token
  }

  //@UseGuards(AuthenticatedGuard)
  @Get('protected')
  getHello(@Request() req): string{ //todo: require bearer token, validate token
    return req.user;
  }

}