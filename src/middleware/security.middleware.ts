import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private allowedOrigins: string[];
  private readonly logger = new Logger(SecurityMiddleware.name);

  constructor() {
    this.allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : [];
  }

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const origin = req.headers.origin;

    // ✅ CORS dengan whitelist
    if (origin && this.allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      );
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } else {
      if (origin) {
        this.logger.warn(
          `🚨 Blocked request from unauthorized origin: ${origin}`,
        );
      } else {
        this.logger.warn(`⚠️ Request tanpa origin header`);
      }
    }

    // ✅ CSP header
    const csp = [
      `default-src ${process.env.CSP_DEFAULT_SRC || "'self'"}`,
      `script-src ${process.env.CSP_SCRIPT_SRC || "'self'"}`,
      `style-src ${process.env.CSP_STYLE_SRC || "'self'"}`,
      `img-src ${process.env.CSP_IMG_SRC || '*'} data:`,
      `font-src ${process.env.CSP_FONT_SRC || "'self'"}`,
    ].join('; ');

    res.header('Content-Security-Policy', csp);

    // ✅ OPTIONS preflight
    if (req.method === 'OPTIONS') {
      res.status(204).send();
      return;
    }

    next();
  }
}
