"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("../src/app.module");
const common_1 = require("@nestjs/common");
let server;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    const logger = new common_1.Logger('Bootstrap');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Docs')
        .setDescription('API description')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const allowed = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
        : ['*'];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowed.includes(origin) || allowed.includes('*')) {
                callback(null, true);
            }
            else {
                callback(new Error(`❌ Origin ${origin} not allowed by CORS`), false);
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    return app;
}
async function handler(req, res) {
    if (!server) {
        const app = await bootstrap();
        const fastify = app.getHttpAdapter().getInstance();
        server = (req, res) => fastify.routing(req, res);
    }
    return server(req, res);
}
//# sourceMappingURL=index.js.map