import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {User} from "@prisma/client";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async toggleFavoriteBook(userId: number, bookId: number): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id: +userId }, include: { favorites: true } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isBookInFavorites = user.favorites.some((book) => book.id === +bookId);

        if (isBookInFavorites) {
            await this.prisma.user.update({
                where: { id: +userId },
                data: { favorites: { disconnect: { id: +bookId } } },
            });
        } else {
            await this.prisma.user.update({
                where: { id: +userId },
                data: { favorites: { connect: { id: +bookId } } },
            });
        }

        return this.prisma.user.findUnique({ where: { id: +userId }, include: { favorites: true } });
    }
}