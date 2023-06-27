import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {DictionaryWords} from "@prisma/client";
import {CreateWordDto} from "./dto/createword.dto";

@Injectable()
export class DictionaryService {
    constructor(private prisma: PrismaService) {}

    async getAllWords(userId: number): Promise<DictionaryWords[]> {
        return this.prisma.userDictionary
            .findUnique({
                where: { userId },
            })
            .words();
    }
    async addWord(
        userId: number,
        createWordDto: CreateWordDto,
    ): Promise<DictionaryWords> {
        const { word, translation } = createWordDto;

        return this.prisma.dictionaryWords.create({
            data: {
                word,
                translation,
                userDictionary: {
                    connect: { userId },
                },
            },
        });
    }

    async deleteWord(userId: number, wordId: number): Promise<void> {
        await this.prisma.dictionaryWords.deleteMany({
            where: {
                id: +wordId,
                userDictionary: {
                    userId,
                },
            },
        });

    }
}

