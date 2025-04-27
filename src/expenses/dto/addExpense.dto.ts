import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class AddExpenseDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    description ?: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @Min(5, {message: "Expense amount cannot be less than 5 naira"})
    amount: number;
}