import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto';
import { LocalAuthGuard} from './guards/local.guard';

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
    @Post('login')
    login(@Req() req){
        return req.user;
    }
}
