"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const fs_1 = require("fs");
const serverless_express_1 = __importDefault(require("@vendia/serverless-express"));
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
    if (process.env.CHECK_DASAR === 'development') {
        app.enableCors();
        const pathToSwaggerStaticFolder = (0, path_1.resolve)(process.cwd(), 'swagger-static');
        const pathToSwaggerJson = (0, path_1.resolve)(pathToSwaggerStaticFolder, 'swagger.json');
        const swaggerJson = JSON.stringify(document, null, 2);
        (0, fs_1.writeFileSync)(pathToSwaggerJson, swaggerJson);
        console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
    }
    else {
        swagger_1.SwaggerModule.setup('docs', app, document, {
            jsonDocumentUrl: 'swagger/json',
            customfavIcon: 'https://placecats.com/300/200',
        });
        app.enableCors({
            origin: ['https://demo-1.haruman.me'],
            methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
        });
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
        server = (0, serverless_express_1.default)({ app: expressApp });
    }
    return server(req, res);
}
//# sourceMappingURL=main.js.map