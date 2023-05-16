import {Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import {DictionaryWords, User} from "@prisma/client";
import {CreateWordDto} from "./dto/createword.dto";
import {Auth} from "../auth/decorators/auth.decorator";
import {CurrentUser} from "../auth/decorators/user.decorator";

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {
  }

  @Auth()
  @Get('all')
  async getAllWords(@CurrentUser() user: User): Promise<DictionaryWords[]> {
    return this.dictionaryService.getAllWords(user.id);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Post('add')
  async addWord(@CurrentUser() user: User, @Body() createWordDto: CreateWordDto,): Promise<DictionaryWords> {
    return this.dictionaryService.addWord(user.id, createWordDto);
  }

  @Auth()
  @Delete('delete/:wordId')
  async deleteWord(@CurrentUser() user: User, @Param('wordId') wordId: number,): Promise<void> {
    return this.dictionaryService.deleteWord(user.id, wordId);
  }
}
