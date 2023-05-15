import {Body, Controller, Get, Param, Post, Query, Res, UsePipes, ValidationPipe} from '@nestjs/common';
import { Response } from 'express';
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
        @Query('difficulty') difficulty: number,) : Promise<Book[]>
    {
      return this.booksService.getAllBooks(difficulty);
    }

    @Auth()
    @UsePipes(new ValidationPipe())
    @Post('create')
    async createBook(@AdminOnly() user: User, @Body() createBookDto: CreateBookDto): Promise<Book> {
        return this.booksService.createBook(createBookDto);
    }

    @Get(':id/text')
    async getBookText(@Param('id') id: number, @Res() res: Response) {
        const filePath = await this.booksService.getBookTextFilePath(id);
        if (!filePath) {
            return res.status(404).json({ error: 'Book not found' });
        }
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
}
