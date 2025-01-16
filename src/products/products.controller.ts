import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
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
    return this.productsService.createProduct(createProductDto);
  }

 // @Get()
 @MessagePattern({cmd:'find_all_products'})
  findAll(@Payload() paginationDto:PaginationDto) {
    return this.productsService.findAllProducts(paginationDto);
  }

  //@Get(':id')params: FindOneParams
  @MessagePattern({cmd:'find_product_by_id'})
  async findOne(@Payload()findOneParams:FindOneParams) {
    const result = await this.productsService.findProductById(findOneParams.id);
    return result;
  }
  
  //@Patch(':id')
  @MessagePattern({cmd:'update_product'})
 async update(@Payload()payload: { params:FindOneParams; updateProductDto: UpdateProductDto }) {
    const result = await this.productsService.updateProduct(payload.params.id,payload.updateProductDto);
    console.log(payload)
    return result;
  }

  //@Delete(':id')
  @MessagePattern({cmd:'delete_product'})
  async remove(@Payload()params:FindOneParams ) {
    const result = await this.productsService.removeProduct(params.id);
    return result;
  }
}
