import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {RegisterDto} from "./dto/register.dto";
import {hash, verify} from "argon2";
import {JwtService} from "@nestjs/jwt";
import {LoginDto} from "./dto/login.dto";
import {User} from "@prisma/client";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}


    async login(dto: LoginDto) {
        const user = await this.validateUser(dto)
        const tokens = await this.giveJwtToken(user.id, user.isAdmin)
        return {
            user: this.returnUserIdAndEmail(user),
            ...tokens
        }

    }

    async getNewTokens(dto) {
        try{
            const verifiedToken = await this.jwt.verifyAsync(dto.refreshToken)
            const user = await this.prisma.user.findUnique({
                where: {
                    id: verifiedToken.id
                }
            })
            const tokens = await this.giveJwtToken(user.id, user.isAdmin)
            return {
                user: this.returnUserIdAndEmail(user),
                ...tokens
            }
        } catch(e) {
            throw new UnauthorizedException("Invalid refresh token")
        }
    }

    async register(dto: RegisterDto) {
        const oldUser = await this.prisma.user.findUnique({
            where: {
                email:dto.email
            }
        })
        if (oldUser) throw new BadRequestException('User already exists')

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: await hash(dto.password)
            }
        })
        await this.prisma.userDictionary.create({
            data: {
                user: { connect: { id: user.id } },
                words: {},
            },
        });
        const tokens = await this.giveJwtToken(user.id,user.isAdmin)

        return {
            user: this.returnUserIdAndEmail(user),
            ...tokens
        }
    }

    private async giveJwtToken(userId, isAdmin) {
        const data = {id: userId , isAdmin: isAdmin}

        const accessToken = this.jwt.sign(data, {
            expiresIn: "30m"
        })
        const refreshToken = this.jwt.sign(data, {
            expiresIn: "7d"
        })
        return {accessToken, refreshToken}
    }
    private returnUserIdAndEmail(user: User) {
        return {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        }
    }
    private async validateUser( dto: RegisterDto | LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email:dto.email
            }
        })
        if (!user) throw new NotFoundException('User not found')
        const isValid = await verify(user.password, dto.password)
        if (!isValid) throw new UnauthorizedException("Invalid password")

        return user
    }
}
