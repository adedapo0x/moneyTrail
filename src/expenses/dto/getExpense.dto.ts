import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export enum ExpenseTimelineFilter {
    PAST_WEEK = "past-week",
    PAST_MONTH = "past-month",
    LAST_3_MONTHS = "last-3-months",
    LAST_6_MONTHS = "last-6-months",
    CUSTOM = "custom"
}

export enum sortFilter {
    EXPENSE_DATE = "expense-date",
    CREATION_DATE = "date-created",
    UPDATE_DATE = "date-updated"
}

export class GetExpenseDTO {
    @IsOptional()
    @IsEnum(ExpenseTimelineFilter)
    filter?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(5, {message: "Expense cannot be lesser than 5 naira"})
    minAmount: number = 5;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, {message: "maxAmount must be a valid number"})
    maxAmount: number


    @IsOptional()
    @IsEnum(sortFilter)
    sortBy?: string
 
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "Page must be an integer"})
    @Min(1, {message: "Page number must be at least 1"})
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "Limit must be an integer"})
    @Min(1, {message: "Limit must be at least 1"})
    limit?: number = 10;
} 