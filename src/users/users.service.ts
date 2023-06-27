import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {Prisma, User} from "@prisma/client";
@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) {}


}