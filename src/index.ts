import express from 'express';
import dotenv from 'dotenv';
import { router } from './routes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router);

// Swagger configuration
const specs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WhatsApp Warm-up API',
      version: '1.0.0',
      description: 'API para warm-up de números WhatsApp usando Evolution API com estratégia progressiva de estágios',
      contact: {
        name: 'WhatsApp Warm-up API',
        email: 'contact@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/index.ts']
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'WhatsApp Warm-up API Documentation'
}));

// Alternative JSON endpoint
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
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
