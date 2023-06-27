import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post, Put,
    Query,
    Res, UploadedFile, UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {Response} from 'express';
import {BooksService} from './books.service';
import {Book, User} from "@prisma/client";
import {Auth} from "../auth/decorators/auth.decorator";
import {CreateBookDto} from "./dto/book.dto";
import {AdminOnly} from "./decorators/admin.decorator";
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer, { diskStorage } from 'multer';;
import * as fs from "fs";
import {FileInterceptor} from "@nestjs/platform-express";


const multerOptions: MulterOptions = {
    storage: diskStorage({
        destination: 'uploads/coverImages',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
            callback(null, uniqueSuffix + file.originalname);
        },
    }),
};

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

    @Post('create')
    @UseInterceptors(FileInterceptor('coverImage', multerOptions))
    async createBook(
        @UploadedFile() coverImage: Express.Multer.File,
        @Body() createBookDto: CreateBookDto,
    ): Promise<Book> {
        const coverImagePath = coverImage.destination + '/' + coverImage.filename
        const defaultImage = coverImage.destination + '/defaultCover.jpg'
        createBookDto.coverImageUrl = coverImage ? coverImagePath : defaultImage;
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

    @Auth()
    @Put(':userId/favorites/:bookId/toggle')
    async toggleFavoriteBook(
        @Param('userId') userId: number,
        @Param('bookId') bookId: number,
    ): Promise<User> {
        return this.booksService.toggleFavoriteBook(userId, bookId);
    }

    @Auth()
    @Get(':userId/favorites')
    async getFavoriteBooks(
        @Param('userId') userId: number
    ): Promise<Book[]> {
        return this.booksService.getFavoriteBooks(userId)
    }
}
