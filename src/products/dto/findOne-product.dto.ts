
import { Type } from 'class-transformer';
import { IsInt, IsNumberString, IsPositive, Min } from 'class-validator';

export class FindOneParams {
    @Type(()=>Number)
  @IsInt()
  @IsPositive()
  @Min(0)
  id: number;
}
