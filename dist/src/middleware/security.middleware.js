"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SecurityMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityMiddleware = void 0;
const common_1 = require("@nestjs/common");
let SecurityMiddleware = SecurityMiddleware_1 = class SecurityMiddleware {
    constructor() {
        this.logger = new common_1.Logger(SecurityMiddleware_1.name);
        this.allowedOrigins = process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
            : [];
    }
    use(req, res, next) {
        const origin = req.headers.origin;
        if (origin && this.allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Vary', 'Origin');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }
        else {
            if (origin) {
                this.logger.warn(`🚨 Blocked request from unauthorized origin: ${origin}`);
            }
            else {
                this.logger.warn(`⚠️ Request tanpa origin header`);
            }
        }
        const csp = [
            `default-src ${process.env.CSP_DEFAULT_SRC || "'self'"}`,
            `script-src ${process.env.CSP_SCRIPT_SRC || "'self'"}`,
            `style-src ${process.env.CSP_STYLE_SRC || "'self'"}`,
            `img-src ${process.env.CSP_IMG_SRC || '*'} data:`,
            `font-src ${process.env.CSP_FONT_SRC || "'self'"}`,
        ].join('; ');
        res.header('Content-Security-Policy', csp);
        if (req.method === 'OPTIONS') {
            res.status(204).send();
            return;
        }
        next();
    }
};
exports.SecurityMiddleware = SecurityMiddleware;
exports.SecurityMiddleware = SecurityMiddleware = SecurityMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SecurityMiddleware);
//# sourceMappingURL=security.middleware.js.map