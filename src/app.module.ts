import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PrismaService} from "./prisma.service";
import {AuthModule} from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import {BooksModule} from './books/books.module';
import {DictionaryModule} from './dictionary/dictionary.module';
import {UsersModule} from './users/users.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),
        ConfigModule.forRoot(), AuthModule, BooksModule, DictionaryModule, UsersModule],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {
}
