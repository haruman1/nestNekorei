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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
let SwaggerController = class SwaggerController {
    getSwaggerUI(res) {
        res.send(`
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swagger API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
  <style>
    body {
      transition: background-color 0.5s ease, color 0.5s ease;
    }

    /* Animasi slide masuk dari kiri */
    #swagger-ui {
      transform: translateX(-100%);
      opacity: 0;
      transition: transform 0.6s ease, opacity 0.6s ease;
    }
    #swagger-ui.show {
      transform: translateX(0);
      opacity: 1;
    }

    /* Tombol toggle di kanan bawah */
    #theme-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 14px;
      background: #222;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      z-index: 9999;
    }
    #theme-toggle.light {
      background: #f1f1f1;
      color: #000;
    }
  </style>
</head>
<body>

  <div id="swagger-ui"></div>
  <button id="theme-toggle">☀️ Light Mode</button>

  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", function () {
      const ui = SwaggerUIBundle({
        url: '/swagger-json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });

      // Animasi slide masuk
      setTimeout(() => {
        document.getElementById('swagger-ui').classList.add('show');
      }, 100);

      // Toggle theme
      const toggleBtn = document.getElementById('theme-toggle');
      let darkMode = false;

      toggleBtn.addEventListener('click', () => {
        darkMode = !darkMode;
        if (darkMode) {
          document.body.style.backgroundColor = '#1e1e1e';
          document.body.style.color = '#fff';
          toggleBtn.textContent = '🌙 Dark Mode';
          toggleBtn.classList.remove('light');
        } else {
          document.body.style.backgroundColor = '#fff';
          document.body.style.color = '#000';
          toggleBtn.textContent = '☀️ Light Mode';
          toggleBtn.classList.add('light');
        }
      });

      // Set default dark mode
        document.body.style.backgroundColor = '#fff';
        document.body.style.color = '#000';
    });
  </script>
</body>
</html>

    `);
    }
};
exports.SwaggerController = SwaggerController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SwaggerController.prototype, "getSwaggerUI", null);
exports.SwaggerController = SwaggerController = __decorate([
    (0, common_1.Controller)('swagger')
], SwaggerController);
//# sourceMappingURL=swagger.controller.js.map