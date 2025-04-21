import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { SafeUser } from 'src/auth/types/safeeUser.type';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getCurrentUser(@GetUser() user: SafeUser){
        return this.userService.getLoggedInUser(user);
    }
}
