import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto';
import { LocalAuthGuard} from './guards/local.guard';
import { GetUser } from './decorators/getUser.decorator';
import { SafeUser } from './types/safeeUser.type';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('register')
    async register(@Body() dto: RegisterDTO){
        const registeredUser = await this.authService.register(dto);    
        return {
            message: "User created successfully",
            user: {
                username: registeredUser.username
            }
        }
    }
    
    
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@GetUser() user: SafeUser, @Res({passthrough: true}) res: Response){
        return this.authService.login(user, res)
    }
}
