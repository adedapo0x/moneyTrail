import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AddExpenseDTO, PaginateQueryDTO, UpdateExpenseDTO } from './dto';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('expenses')
export class ExpensesController {
    constructor(private expenseService: ExpensesService){}

    
    @UseGuards(JwtAuthGuard)
    @Post()
    async addExpense(@GetUser('id') userID: string, @Body() expense: AddExpenseDTO){
        const newExpense = await this.expenseService.addExpense(userID, expense);
        return {
            "message": "New expense created",
            newExpense
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteExpense(@GetUser('id') userID: string, @Param('id') expenseID: string){
        await this.expenseService.deleteExpense(userID, expenseID);
        return {
            message: "Expense successfully deleted"
        }
    }

    
    @UseGuards(JwtAuthGuard)
    @Get()
    async getExpenses(@GetUser('id') userID: string, @Query() paginationDTO: PaginateQueryDTO){
        return this.expenseService.getExpenses(userID, paginationDTO);
    }


    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateExpense(@GetUser('id') userID: string, @Body() updateBody: UpdateExpenseDTO, @Param('id') expenseID: string){
        const updatedExpense = await this.expenseService.updateExpense(userID, updateBody, expenseID);
        return {
            "message": "Expense has been updated successfully",
            updatedExpense
        }
    }
}
