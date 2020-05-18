require("dotenv").config();
import express, { Request, Response } from "express";
import next from "next";
import { createProxyMiddleware } from "http-proxy-middleware";


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
const apiHost = process.env.API_HOST || 'https://insights-api.ksense.ai';

(async () => {
  try {
    await app.prepare();
    const server = express();

    server.use(
      '/api/*',
      createProxyMiddleware({
        target: apiHost,
        changeOrigin: true,
        logProvider: () => console,
        logLevel:"debug"
      })
    );

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
