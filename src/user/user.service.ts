import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async getUser(email: string){
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email
                }
            })
            if (!user){
                throw new UnauthorizedException("User not found");
            }
            return user;    
        } catch (error) {
            throw new Error("Failed to get user!")
        }
        
    }
}
