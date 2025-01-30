
import {IsBoolean, IsNotEmpty,IsOptional,IsUUID } from 'class-validator';

export class FindOneParams {

  @IsNotEmpty()
  @IsUUID()
  id: string;

}
