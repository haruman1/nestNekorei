import { NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
export declare class SecurityMiddleware implements NestMiddleware {
    private readonly allowedOrigins;
    private readonly logger;
    constructor();
    use(req: FastifyRequest, res: FastifyReply, next: () => void): void;
}
