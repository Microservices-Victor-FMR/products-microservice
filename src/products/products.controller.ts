import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FindOneParams } from './dto/findOne-product.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //@Post()
  @MessagePattern({cmd: 'create_product'})
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

 // @Get()
 @MessagePattern('fiind_all_products')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  //@Get(':id')
  @MessagePattern('find_product_by_id')
  async findOne(@Payload('id') params: FindOneParams) {
    const result = await this.productsService.findOne(params.id);
    return result;
  }

  //@Patch(':id')
  @MessagePattern('update_product')
  update(
    //@Body() 
    updateProductDto: UpdateProductDto,
    @Payload('id')params: FindOneParams,
    
    ) {
    return this.productsService.update(params.id, updateProductDto);
  }

  //@Delete(':id')
  @MessagePattern('delete_product')
  remove(@Payload('id')params: FindOneParams ) {
    return this.productsService.remove(params.id);
  }
}
