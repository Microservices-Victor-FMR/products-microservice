
import { Type } from 'class-transformer';
import { IsInt, IsNumberString, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class FindOneParams {
  @Type(()=>Number)
  @IsInt()
  @IsPositive()
  @Min(0)
  id: number;

}
