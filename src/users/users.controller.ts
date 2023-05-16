import {Controller, Param, Post} from '@nestjs/common';
import { UsersService } from './users.service';
import {User} from "@prisma/client";
import {Auth} from "../auth/decorators/auth.decorator";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Auth()
  @Post(':userId/favorites/:bookId/toggle')
  async toggleFavoriteBook(
      @Param('userId') userId: number,
      @Param('bookId') bookId: number,
  ): Promise<User> {
    return this.userService.toggleFavoriteBook(userId, bookId);
  }
}