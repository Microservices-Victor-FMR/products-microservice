import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    @IsPositive({ message: 'Page number must be a positive number' })
    @IsOptional()
    @IsNumber()
    @Type(()=>Number)
    page?: number = 1;

    @IsNumber()
    @IsOptional()
    @Type(()=>Number)
    @IsPositive({ message: 'Limit number must be a positive number' })
    limit?: number=5;
}
