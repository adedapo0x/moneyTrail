import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddExpenseDTO, PaginateQueryDTO, UpdateExpenseDTO } from './dto';
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


    async getExpenses(userID: string, paginationDTO: PaginateQueryDTO){
        const {page = 1, limit = 10 } = paginationDTO;
        const skip = (page - 1) * limit

        const [expenses, total] = await Promise.all([
            this.prisma.expense.findMany({
                where: {userID, isDeleted: false },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" }
            }),
            this.prisma.expense.count({
                where: {userID, isDeleted: false}
            })
        ])

        const totalPages = Math.ceil(total / limit);

        return {
            data: expenses,
            meta: {
                currentPage: page,
                totalPages,
                totalItems: total,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }
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
