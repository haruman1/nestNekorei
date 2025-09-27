"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
let server;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nekorei API')
        .setDescription('The cats API description')
        .addServer(process.env.CHECK_DASAR === 'production'
        ? 'https://demo-1.haruman.me'
        : 'http://localhost:3001')
        .setVersion('1.0')
        .build();
    const options = {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
    };
    const document = swagger_1.SwaggerModule.createDocument(app, config, options);
    const isVercel = !!process.env.VERCEL;
    if (!isVercel) {
        swagger_1.SwaggerModule.setup('docs', app, document);
    }
    else {
        app.use('/swagger-static', express_1.default.static((0, path_1.join)(__dirname, 'swagger-static')));
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                url: '/swagger-json',
            },
            customCssUrl: ['https://unpkg.com/swagger-ui-dist/swagger-ui.css'],
            customJs: [
                'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
                'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
            ],
        });
        app.enableCors();
    }
    app.getHttpAdapter().get('/swagger-json', (req, res) => {
        res.json(document);
    });
    await app.init();
    return app.getHttpAdapter().getInstance();
}
async function handler(req, res) {
    if (!server) {
        const expressApp = await bootstrap();
        server = (req, res) => expressApp(req, res);
    }
    return server(req, res);
}
//# sourceMappingURL=main.js.map