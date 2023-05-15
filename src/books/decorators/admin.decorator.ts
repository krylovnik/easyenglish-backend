import {createParamDecorator, ExecutionContext, ForbiddenException} from '@nestjs/common';
import {User} from "@prisma/client";

export const AdminOnly = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: User = request.user;

        if (!user.isAdmin) {
            throw new ForbiddenException('Only admins have permission to do it');
        }

        return user;
    },
);