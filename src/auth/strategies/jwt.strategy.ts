import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.Authentication
      ]),
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET_KEY'),
    });
  }

  async validate(payload: {username: string, sub: string}) {
    return { userId: payload.sub, username: payload.username };
  }
}
