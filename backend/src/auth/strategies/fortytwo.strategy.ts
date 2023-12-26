import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { HttpService } from "@nestjs/axios";
import { Strategy } from "passport-oauth2";
import { stringify } from "querystring";
import { User } from "src/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { UserDto } from "src/dtos/user.dto";
import { AuthService } from "../auth.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, 'fortytwo') {
    constructor(
        private readonly http: HttpService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {
        super({
            authorizationURL: `https://api.intra.42.fr/oauth/authorize?${stringify({
                client_id: process.env.OAUTH2_CLIENT_ID,
                redirect_uri: process.env.OAUTH2_REDIRECT_URI,
                response_type: 'code',
            })}`,
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            grant_type: 'authorization_code',
            clientID: process.env.OAUTH2_CLIENT_ID,
            clientSecret: process.env.OAUTH2_CLIENT_SECRET,
            callbackURL: process.env.OAUTH2_CALLBACK_URI,
            scope: ['public'],
        })
    }

    async validate(
        accessToken: string,
    ): Promise<Partial<UserDto>> {
        const { data } = await this.http.axiosRef.get('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("Oauth2 validate:" + data.data);

        const user = await this.usersService.FindOneBySchoolId(data.id);

        if (user) {
            if (user.is2FAEnabled) {
              const qrCodeUrl = await this.qrCodeService.generateQrCode(user.id);
              return { qrCodeUrl };
            }
            return user;

        const user_dto: Partial<UserDto> = {
            schoolId: data.id,
            username: data.login,
            email: data.email,
        };

        return this.authService.register(user_dto);
    }
}