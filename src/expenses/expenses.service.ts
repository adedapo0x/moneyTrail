import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddExpenseDTO, ExpenseTimelineFilter, GetExpenseDTO, UpdateExpenseDTO } from './dto';
import { subDays, subMonths } from "date-fns"
import { GetQueryInterface } from './interface/get-query.interface';


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
        const {filter, startDate, endDate , page = 1, limit = 10, minAmount , maxAmount, sortBy} = getQueryDTO;
        const skip = (page - 1) * limit

        if (minAmount && maxAmount && minAmount > maxAmount){
            throw new BadRequestException("minAmount cannot be greater than maxAmount");
        }

        if (filter !== ExpenseTimelineFilter.CUSTOM && (startDate || endDate)){
            throw new BadRequestException("Filter must be set to custom to use start or end date filters");
        }

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

                // ensure that end date covers up until just before the next day
                computedEndDate.setHours(23, 59, 59, 999);

                if (computedStartDate > computedEndDate){
                    throw new BadRequestException("Start date must be before end date")
                }
                break
            case undefined:
                // No filtering included in query
                break
            default:
                throw new BadRequestException("Invalid filter");
        }


        // build the whereClause to be used in DB query
        const whereClause: GetQueryInterface = {
            userID,
            isDeleted: false,
        }

        // if date filters are valid and available, add to where clause
        if (computedStartDate && computedEndDate){
            whereClause.expenseDate = {
                gte: computedStartDate,
                lte: computedEndDate
             } 
        } 

        // If sorting by amount/cost is included
        if (minAmount || maxAmount){
            whereClause.amount = {
                ...(minAmount && { gte: minAmount}),
                ...(maxAmount && { lte: maxAmount})
            }
        }

        const sortFieldMap = {
            'date-created': 'createdAt',
            'date-updated': 'updatedAt',
            'expense-date': 'expenseDate'
        }

        const sortField = sortBy ? sortFieldMap[sortBy?.toLowerCase()] : "expenseDate"

        const [expenses, total] = await Promise.all([
            this.prisma.expense.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { [sortField]: "desc"}
            }),
            this.prisma.expense.count({
                where: whereClause
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
