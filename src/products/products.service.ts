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
    const { name } = createProductDto;
    const findProduct = await this.prismaService.product.findFirst({ where: { name: name } });

    if (findProduct) {
      this.errorHandlerService.ErrorFound(`Este Producto ${name}, Ya Existe.`, "Products");
    }

    const result = await this.prismaService.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
      },
    });

    return { message: `Producto ${name} creado`, data: result };
  }

  async findAllProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const total_register = await this.prismaService.product.count();
    const totalPages = Math.ceil(total_register / limit);

    const result = await this.prismaService.product.findMany({
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

  async findProductById(id: number) {
    
      const product = await this.prismaService.product.findUnique({ where: { id: id } });

      if (!product) {
        this.errorHandlerService.ErrorNotFound("Producto no encontrado", "Products");
      }
      return product;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const findProduct = await this.findProductById(id);

    if (!findProduct) {
      this.errorHandlerService.ErrorNotFound("Producto no encontrado", "Products");
    }


    const updatedProduct = await this.prismaService.product.update({
      where: { id: id },
      data: updateProductDto,
    });

    return { message: "Producto actualizado correctamente", data: updatedProduct };
  }

  async removeProduct(id: number) {
    const findProduct = (await this.findProductById(id));
    if (!findProduct) {
      this.errorHandlerService.ErrorNotFound( 'Producto no encontrado', "Products");
    }

    if(findProduct.available=== false){
      this.errorHandlerService.ErrorGone('Producto ya no disponible', 'Products');


    }
    await this.prismaService.product.update({
      data: { available: false },
      where: { id: id },
    });
    return { message: `Product with id ${id} has been removed` };
  }
}
