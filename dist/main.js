"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const server = (0, express_1.default)();
const platform_express_1 = require("@nestjs/platform-express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
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
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                url: '/swagger-static/swagger.json',
            },
            customfavIcon: 'https://placecats.com/300/200',
            customCssUrl: ['https://unpkg.com/swagger-ui-dist/swagger-ui.css'],
            customJs: [
                'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
                'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
            ],
        });
        app.enableCors();
        const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '/swagger-static/swagger.json'), 'utf8'));
        app.getHttpAdapter().get('/swagger-json', (req, res) => {
            res.json(swaggerDocument);
        });
        await app.init();
        return app.getHttpAdapter().getInstance();
    }
}
bootstrap();
exports.default = server;
//# sourceMappingURL=main.js.map