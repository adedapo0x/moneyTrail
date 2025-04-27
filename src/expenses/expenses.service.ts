import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddExpenseDTO, ExpenseTimelineFilter, GetExpenseDTO, UpdateExpenseDTO } from './dto';
import { subDays, subMonths } from "date-fns"
import { throwError } from 'rxjs';


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


    async getExpenses(userID: string, getQueryDTO: GetExpenseDTO){
        const {filter, startDate, endDate , page = 1, limit = 10 } = getQueryDTO;
        const skip = (page - 1) * limit

        let computedStartDate: Date | undefined;
        let computedEndDate: Date | undefined;

        const now = new Date()

        switch (filter) {
            case ExpenseTimelineFilter.PAST_WEEK:
                computedStartDate = subDays(now, 7);
                computedEndDate = now;
                break;
            case ExpenseTimelineFilter.PAST_MONTH:
                computedStartDate = subDays(now, 30)
                computedEndDate = now
                break
            case ExpenseTimelineFilter.LAST_3_MONTHS:
                computedStartDate = subMonths(now, 3)
                computedEndDate = now
                break
            case ExpenseTimelineFilter.LAST_6_MONTHS:
                computedStartDate = subMonths(now, 6)
                computedEndDate = now
                break
            case ExpenseTimelineFilter.CUSTOM:
                if (!startDate || !endDate)
                    throw new BadRequestException("Start and end date must be provided for custom filters");
                computedStartDate = new Date(startDate);
                computedEndDate = new Date(endDate)
                if (computedStartDate > computedEndDate){
                    throw new BadRequestException("Start date must be before end date")
                }
                break
            default:
                throw new BadRequestException("Invalid filter");
        }

        const [expenses, total] = await Promise.all([
            this.prisma.expense.findMany({
                where: {userID, isDeleted: false },
                skip,
                take: limit,
                orderBy: { updatedAt: "desc" }
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
