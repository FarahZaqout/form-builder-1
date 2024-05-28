const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = parseInt(process.env.PORT, 10) || 4000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(bodyParser.json());

    server.use('/api', createProxyMiddleware({
        target: 'http://161.35.236.145',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '/app/doctype/TestDoc',
        },
        onProxyReq: (proxyReq, req, res) => {
            console.log(`Request Method: ${req.method}`);
            proxyReq.setHeader('Authorization', 'Bearer 2bb03d902b9aedc');

            if (req.body && !isEmpty(req.body)) {
                let bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
                console.log({res})
            }
        }
    }));

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
