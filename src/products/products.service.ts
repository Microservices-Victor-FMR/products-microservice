import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const result = await this.prismaService.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
      },
    });

    return result;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const total_register = await this.prismaService.product.count();
    const totalPages = Math.ceil(total_register / limit);

    const result = await this.prismaService.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where:{available:true}
    });

    return {
      data: result,
      page: page,
      totalPage: totalPages,
    };
  }

  async findOne(id: number) {
    const findById = await this.prismaService.product.findUnique({ where: { id: id,available:true } });
    if (!findById) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return findById;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
   await this.findOne(id)

    const updatedProduct = await this.prismaService.product.update({
      where: { id: id },
      data: updateProductDto,
    });

    return updatedProduct;
  }

  async remove(id: number) {
   await this.findOne(id)

    await this.prismaService.product.update({data:{available: false},where:{id:id}})
    return { message: `Product with id ${id} has been removed` };
  }
}
