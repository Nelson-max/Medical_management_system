module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Medical store managment system Project',
    version: '1.0.0',
    description: 'Documentation of Medical store system managment API'
  },
  basePath: '/',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};
