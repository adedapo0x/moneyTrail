import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateExpenseDTO {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    description ?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    category?: string;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    @IsPositive()
    amount?: number;
}