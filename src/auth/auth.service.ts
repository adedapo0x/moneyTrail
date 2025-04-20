import { ConflictException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDTO } from './dto/register.dto';
import * as argon2 from 'argon2'
import * as ms from "ms"
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SafeUser } from './types/safeeUser.type';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { max } from 'class-validator';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private userService: UserService, private configService: ConfigService,
        private jwtService: JwtService
    ){}

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
            if (error instanceof UnauthorizedException){
                throw new UnauthorizedException("Credentials do not match")
            }
            throw new UnauthorizedException('Error occured while logging in')
        }
    }

    async login(user: SafeUser, res: Response){
        const payload = {username: user.username, sub: user.id}
        const jwtExpiryTime = this.configService.getOrThrow("JWT_ACCESS_TOKEN_EXPIRY_TIME")
        const secret = this.configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET_KEY")

        const accessToken = this.jwtService.sign(payload, {
            secret, 
            expiresIn: jwtExpiryTime
        })

        const maxAge = parseInt(ms(jwtExpiryTime));
        
        res.cookie('Authentication', accessToken, {
            httpOnly: true,
            secure: this.configService.get("NODE_ENV") === 'production',
            maxAge
        })
    }    
}
