import { Type } from 'class-transformer';
import { IsString, IsNumber, Min, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Type(() => Number)
  public price: number;

  @IsOptional()
  @IsString()
  descripcion? : string
 
  @IsNotEmpty()
  @IsString()
  image_url: string
  
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  quantity_available: number;
}
