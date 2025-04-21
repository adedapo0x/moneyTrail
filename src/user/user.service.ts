import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { SafeUser } from 'src/auth/types/safeeUser.type';
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

    async getLoggedInUser(user: SafeUser){
        const userId = user.id;
        const currentUser = await this.prisma.user.findFirst({
            where: {
                id: userId
            }
        })

        if (!currentUser){
            throw new UnauthorizedException()
        }
        const {passwordHash, ...loggedInUser} = currentUser;
        return loggedInUser;
    }

}
