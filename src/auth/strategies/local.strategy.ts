
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { plainToInstance } from 'class-transformer';
import { LoginDTO } from '../dto';
import { validate } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
        usernameField: 'email'
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // create a DTO  instance from the credentials
    const loginDTO = plainToInstance(LoginDTO, {email, password})
    // validate using the same rules as DTO
    const errors = await validate(loginDTO)
    if (errors.length > 0){
        throw new BadRequestException("Invalid input")
    } 
    const user = await this.authService.authenticateUser(email, password);
    if (!user) {
      throw new UnauthorizedException("Credentials do not match");
    }
    return user;
  }
}
