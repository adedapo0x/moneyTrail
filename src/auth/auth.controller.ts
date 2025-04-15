import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post()
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


    @Post()
    login(){
        "hello sir"
    }
}
