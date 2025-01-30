import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaService } from 'src/prisma.service';
import { ErrorHandlerService } from 'src/common/errors/error-handler-service';
import { FindOneParams } from './dto/findOne-product.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService, 
    private readonly errorHandlerService: ErrorHandlerService,
    @Inject('NATS_SERVICE') private readonly nats_products: ClientProxy
  
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const { name,image_url,price,descripcion,quantity_available } = createProductDto;
    const findProduct = await this.prismaService.products.findFirst({ where: { name: name } });

    if (findProduct) {
      this.errorHandlerService.ErrorFound(`Este Producto ${name}, Ya Existe.`, "Products");
    }

    const result = await this.prismaService.products.create({
      data: {
        name: name,
        price: price,
        description: descripcion,
        image_url: image_url,
      },
    });

    this.nats_products.emit('createProduct',{product_id: result.id, quantity_available: quantity_available})

    return { message: `Producto ${name} creado`, data:result,quantity_available:quantity_available };
    
  }

  async findAllProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const total_register = await this.prismaService.products.count();
    const totalPages = Math.ceil(total_register / limit);

    const result = await this.prismaService.products.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { available: true },
    });

    return {
      data: result,
      page: page,
      totalPage: totalPages,
    };
  }

  async findProductById(id:string) {

    
      const product = await this.prismaService.products.findUnique({ where: { id: id} });

       if(!product){
        this.errorHandlerService.ErrorNotFound(`Producto no encontrado`, "Products");
       }

       if (product.available===false){
        this.errorHandlerService.ErrorGone('Este producto no esta disponible', 'Products')
       }

      return product


  }

  async updateProduct(product_id:string, updateProductDto: UpdateProductDto) {
   
    const findProduct = await this.findProductById(product_id);

    if (!findProduct) {
      this.errorHandlerService.ErrorNotFound("Producto no encontrado", "Products");
    }


    const updatedProduct = await this.prismaService.products.update({
      where: { id: product_id },
      data: updateProductDto,
    });

    return { message: "Producto actualizado correctamente", data: updatedProduct };
  }

  async removeProduct(product_id:string) {
    const findProduct = await this.findProductById(product_id);

    if (!findProduct) {
      this.errorHandlerService.ErrorNotFound( 'Producto no encontrado', "Products");
    }
    
    if(findProduct.available=== false){
      this.errorHandlerService.ErrorGone('Producto ya no disponible', 'Products');
    }
   const deleteProduct=  await this.prismaService.products.update({
      data: { available: false },
      where: { id: product_id },
    });
  

    this.nats_products.emit('deleteProduct',{product_id:deleteProduct.id})
    return { message: "Producto eliminado correctamente",deleteProduct};
  }

  async findproductsByIds(ids:string[]){

   const findMany = await this.prismaService.products.findMany({where: {id: {in: ids},available:true}})
     if(!findMany || findMany.length===0){
      this.errorHandlerService.ErrorNotFound('Producto no encontrado', 'Products')
     }
       
    const productAvailable = findMany.every(product => product.available);

    if (!productAvailable) {
    this.errorHandlerService.ErrorGone('Producto ya no disponible', 'Products');
    }
  
      return findMany
  }
}
