import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaService } from 'src/prisma.service';
import { ErrorHandlerService } from 'src/common/errors/error-handler-service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService, private readonly errorHandlerService: ErrorHandlerService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const { name,image_url,price,descripcion } = createProductDto;
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

    return { message: `Producto ${name} creado`, data: result };
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

  async findProductById(id: string) {
    
      const product = await this.prismaService.products.findUnique({ where: { id: id } });

      if (!product) {
        this.errorHandlerService.ErrorNotFound("Producto no encontrado", "Products");
      }
      return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const findProduct = await this.findProductById(id);

    if (!findProduct) {
      this.errorHandlerService.ErrorNotFound("Producto no encontrado", "Products");
    }


    const updatedProduct = await this.prismaService.products.update({
      where: { id: id },
      data: updateProductDto,
    });

    return { message: "Producto actualizado correctamente", data: updatedProduct };
  }

  async removeProduct(id: string) {
    const findProduct = (await this.findProductById(id));
    if (!findProduct) {
      this.errorHandlerService.ErrorNotFound( 'Producto no encontrado', "Products");
    }

    if(findProduct.available=== false){
      this.errorHandlerService.ErrorGone('Producto ya no disponible', 'Products');


    }
    await this.prismaService.products.update({
      data: { available: false },
      where: { id: id },
    });
    return { message: `Product with id ${id} has been removed` };
  }
}
