import {IsNumber, IsOptional, IsString, Min, MinLength} from "class-validator";

export class CreateBookDto {
    @IsString()
    title: string;

    @IsString()
    text: string;

    @IsString()
    description: string;

    @IsString()
    author: string;

    @IsString()
    @IsOptional()
    coverImageUlr?: string;

    @IsNumber()
    difficult: number;
}