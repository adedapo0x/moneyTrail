import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDTO } from './dto/register.dto';
import * as argon2 from 'argon2'
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private userService: UserService){}

    async register(dto: RegisterDTO){
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {email: dto.email}
            })    
            if (existingUser){
                throw new ConflictException('User already exists')
            }
            const hashedPassword = await argon2.hash(dto.password);

            return this.prisma.user.create({
                data: {
                    email: dto.email,
                    username: dto.username,
                    passwordHash: hashedPassword
                }
            })
        } catch (error) {
            if (error instanceof HttpException){
                throw error;
            }
            throw new InternalServerErrorException('Error occured during user registration. Kindly try again')
        }
            
    }

    async authenticateUser(email: string, password: string){
        try {
            const user = await this.userService.getUser(email);
            const pwMatches = await argon2.verify(user.passwordHash, password);

            if (user && pwMatches){
                const {passwordHash, ...sanitizedUser} = user;
                return sanitizedUser;
            }
            return null;
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException('Credentials do not match')
        }
    }

    async login(user){

    }


    
}
