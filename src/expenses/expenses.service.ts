import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddExpenseDTO } from './dto';
import { use } from 'passport';

@Injectable()
export class ExpensesService {
    constructor(private prisma: PrismaService){}

    async addExpense(userID: string, expense: AddExpenseDTO){
        return this.prisma.expense.create({
            data: {
                ...expense,
                userID
            }
        })   
    }
}
