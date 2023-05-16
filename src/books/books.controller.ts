import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    Res,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {Response} from 'express';
import {BooksService} from './books.service';
import {Book, User} from "@prisma/client";
import {Auth} from "../auth/decorators/auth.decorator";
import {CreateBookDto} from "./dto/book.dto";
import {AdminOnly} from "./decorators/admin.decorator";
import * as fs from "fs";

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {
    }

    @Auth()
    @Get('getAll')
    async getAllBooks(
        @Query('difficulty') difficulty: number,): Promise<Book[]> {
        return this.booksService.getAllBooks(difficulty);
    }

    @Auth()
    @UsePipes(new ValidationPipe())
    @Post('create')
    async createBook(@AdminOnly() user: User, @Body() createBookDto: CreateBookDto): Promise<Book> {
        return this.booksService.createBook(createBookDto);
    }

    @Auth()
    @Get(':id/text')
    async getBookText(@Param('id') id: number, @Res() res: Response) {
        const filePath = await this.booksService.getBookTextFilePath(id);
        if (!filePath) {
            throw new NotFoundException('Text not found');
        }
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }

    @Auth()
    @Get(':id')
    async getBookById(@Param('id') id: number) {
        const book = await this.booksService.getBookById(id);
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book
    }
}
