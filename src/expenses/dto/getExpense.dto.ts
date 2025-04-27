import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive, Min } from "class-validator";

export enum ExpenseTimelineFilter {
    PAST_WEEK = "past_week",
    PAST_MONTH = "past_month",
    LAST_3_MONTHS = "last_3_months",
    LAST_6_MONTHS = "last_6_months",
    CUSTOM = "custom"
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
    @IsInt({ message: "Page must be an integer"})
    @Min(1, {message: "Page number must be at least 1"})
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "Limit must be an integer"})
    @Min(1, {message: "Limit must be at least 1"})
    limit?: number = 10;
} 