import app from '../app'
import { Server } from 'http';

const socketServer = new Server(app);

export default socketServer;