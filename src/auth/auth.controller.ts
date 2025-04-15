import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto';
import { LocalAuthGuard} from './guards/local.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('register')
    async register(@Body() dto: RegisterDTO){
        try {
            return this.authService.register(dto);    
        } catch (error) {
            if (error.message == 'User already exists'){
                throw new HttpException('User already exists', HttpStatus.CONFLICT)
            } 
            throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req){
        return req.user;
    }
}
