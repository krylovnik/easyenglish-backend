import {Injectable} from '@nestjs/common';
import {Book} from "@prisma/client";
import {PrismaService} from "../prisma.service";
import {CreateBookDto} from "./dto/book.dto";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllBooks(
        difficulty?: number,
    ): Promise<Book[]> {

        const books = await this.prisma.book.findMany({
            where: {
                difficulty: difficulty !== undefined ? { equals: +difficulty } : undefined,
            }
        });
        return books;
    }
    async createBook(createBookDto: CreateBookDto): Promise<Book> {
        const filePath = 'uploads/texts/' + uuidv4() + '.txt';

        fs.writeFileSync(filePath, createBookDto.text);


        return this.prisma.book.create({
            data: {
                title: createBookDto.title,
                textUrl: filePath,
                description: createBookDto.description,
                author: createBookDto.author,
                coverImageUlr : createBookDto.coverImageUlr,
                difficulty: +createBookDto.difficult,
            },
        });
    }
    async getBookTextFilePath(id: number): Promise<string | null> {
        const book = await this.prisma.book.findUnique({
            where: {
                id: +id
            }
        });
        return book?.textUrl || null;
    }
}