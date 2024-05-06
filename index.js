/**
 *  This is the production entry point
 *  The app is written in NextJS so a custom server is required for self hosting
 *  -- Gerald
 */

import { createServer } from "http";
import { parse } from "url";
import open from "open";
import next from "next";
import ip from "ip";

const hostname = ip.address();
const port = 3000;

const app = next({ dev: false, hostname, port });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      open(`http://${hostname}:${port}`);
    });
});
