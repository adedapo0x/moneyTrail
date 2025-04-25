import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginateQueryDTO {
    
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