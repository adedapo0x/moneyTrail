import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AddExpenseDTO } from './dto';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('expenses')
export class ExpensesController {
    constructor(private expenseService: ExpensesService){}

    @Post("create")
    @UseGuards(JwtAuthGuard)
    async addExpense(@GetUser('id') userID: string, @Body() expense: AddExpenseDTO){
        const newExpense = await this.expenseService.addExpense(userID, expense);
        return {
            "message": "New expense created",
            newExpense
        }
    }

    
}
