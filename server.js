const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Proxy configuration
    server.use(
        '/api',
        createProxyMiddleware({
            target: 'http://161.35.236.145', // The base URL to forward the API requests
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/app/doctype', // Adjust this path rewrite as necessary
            },
        })
    );

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
