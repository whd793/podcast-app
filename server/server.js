import app from './index.js';
import { createServer } from 'http';

// Convert Express app to a serverless-compatible function
const server = createServer(app);

export default server;
