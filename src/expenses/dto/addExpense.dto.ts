import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

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
    amount: number;
}