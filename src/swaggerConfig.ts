import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
  apis: ['./src/entities/**/*Routes.ts'],
  definition: {
    info: {
      description: 'API documentation for Alias Game',
      title: 'API Documentation',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;