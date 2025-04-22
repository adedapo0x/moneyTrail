import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddExpenseDTO, UpdateExpenseDTO } from './dto';
import { use } from 'passport';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

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

    async deleteExpense(userID: string, expenseID: string){
        const expense = await this.prisma.expense.findFirst({
            where: { id: expenseID}
        })
        if (!expense){
            throw new NotFoundException("Expense not found")
        }
        if (expense.userID !== userID){
            throw new UnauthorizedException("You are not authorized to perform this operation")
        }

        await this.prisma.expense.update({
            where: { id: expenseID },
            data: { isDeleted: true }
        })
    }


    async getExpenses(userID: string){
        return this.prisma.expense.findMany({
            where: {
                userID,
                isDeleted: false
            }
        })
    }
    

    async updateExpense(userID: string, updateBody: UpdateExpenseDTO, expenseID: string){
        const expense = await this.prisma.expense.findFirst({
            where: { id: expenseID}
        })
        if (!expense){
            throw new NotFoundException("Expense not found")
        }
        if (expense.userID !== userID){
            throw new UnauthorizedException("You are not authorized to perform this operation")
        }

        return this.prisma.expense.update({
            where: { id: expenseID },
            data: { ...updateBody }
        })
    }
}
