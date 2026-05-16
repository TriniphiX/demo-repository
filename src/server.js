import { createServer } from 'node:http';
import { createApp } from './app.js';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? '0.0.0.0';

const server = createServer(createApp());

server.listen(port, host, () => {
  console.log(`TriniphiX Node.js server running at http://${host}:${port}`);
});
