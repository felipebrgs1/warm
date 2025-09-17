import express from 'express';
import dotenv from 'dotenv';
import { RegisterRoutes } from './tsoa-routes';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Register tsoa routes
RegisterRoutes(app);

// Serve swagger UI with generated spec
const swaggerSpec = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../dist/swagger.json'), 'utf8')
);

// Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'WhatsApp Warm-up API Documentation'
}));

// Alternative JSON endpoint
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/', (_req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        documentation: '/api-docs'
    });
});

app.listen(PORT, () => {
    console.log(`WhatsApp Warm-up API running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
