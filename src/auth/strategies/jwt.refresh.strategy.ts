import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.RefreshAuth
      ]),
      secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET_KEY'),
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: {username: string, sub: string}) {
    console.log("heyy");
    return this.authService.verifyUserRefreshToken(req.cookies?.RefreshAuth, payload.sub);
  }

}
