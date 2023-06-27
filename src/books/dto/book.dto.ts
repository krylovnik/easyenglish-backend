import { IsString } from "class-validator";

export class CreateBookDto {
    @IsString()
    title: string;

    @IsString()
    text: string;

    textUrl: string;
    @IsString()
    description: string;

    @IsString()
    author: string;


    difficulty: number;

    coverImageUrl: string;
}