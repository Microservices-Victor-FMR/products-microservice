import { IsArray, IsUUID } from 'class-validator';

export class FindProductsByIdsDto {
  @IsArray()
  @IsUUID(4, { each: true }) 
  ids: string[]
}