import {Controller} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FindOneParams } from './dto/findOne-product.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @MessagePattern({cmd: 'create_product'})
  async create(@Payload() createProductDto: CreateProductDto) {
   const result = await this.productsService.createProduct(createProductDto);
   return result;
  }

 
 @MessagePattern({cmd:'find_all_products'})
 async findAll(@Payload() paginationDto:PaginationDto) {
   const result = await this.productsService.findAllProducts(paginationDto);
   return result;
  }

  
  @MessagePattern({cmd:'find_product_by_id'})
  async findOne(@Payload()findOneParams:FindOneParams) {
    const result = await this.productsService.findProductById(findOneParams.id);
    return result;
  }
 
  @MessagePattern({cmd:'update_product'})
  async update(@Payload()payload: { params:FindOneParams; updateProductDto: UpdateProductDto }) {
    const result = await this.productsService.updateProduct(payload.params.id,payload.updateProductDto);
    return result;
  }

  @MessagePattern({cmd:'delete_product'})
  async remove(@Payload()params:FindOneParams ) {
    const result = await this.productsService.removeProduct(params.id);
    return result;
  }
}
