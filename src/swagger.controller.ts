import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('swagger')
export class SwaggerController {
  @Get()
  getSwaggerUI(@Res() res: Response) {
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
}
