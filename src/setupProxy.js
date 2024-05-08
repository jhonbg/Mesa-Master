const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/laempacadora/api',
    createProxyMiddleware({
      target: 'http://localhost:80',
      changeOrigin: true,
    })
  );
};