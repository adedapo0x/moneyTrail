import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Post()
    register(@Body() dto){

    }

    @Post()
    login(){
        "hello sir"
    }
}
