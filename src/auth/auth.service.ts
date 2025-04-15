import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDTO } from './dto/register.dto';
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}

    async register(dto: RegisterDTO){
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {email: dto.email}
            })
            
            if (existingUser){
                throw new Error('User already exists')
            }
            const hashedPassword = await argon2.hash(dto.password);
            await this.prisma.user.create({
                data: {
                    email: dto.email,
                    username: dto.username,
                    passwordHash: hashedPassword
                }
            })
        } catch (error) {
            return new BadRequestException('Failed to create user');
        }
        
    }

    
}
