import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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
            if (error instanceof UnauthorizedException){ 
                throw error
            }
            throw new InternalServerErrorException("Failed to get user!")
        }
    }
}
