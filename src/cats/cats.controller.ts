import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    await this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Cat[]> {
    return this.catsService.findByName(name);
  }

  @Get('breed/:breed')
  async findByBreed(@Param('breed') breed: string): Promise<Cat[]> {
    return this.catsService.findByBreed(breed);
  }

  @Get('age/greater/:age')
  async findByAgeGreaterThan(@Param('age') age: number): Promise<Cat[]> {
    return this.catsService.findByAgeGreaterThan(age);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cat> {
    return this.catsService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.catsService.delete(id);
  }
}
