import http from 'http';
import { Server } from 'socket.io';
import { logger } from '../core/utils/logger';

const httpServer = http.createServer();

const socketServer = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

const StartSocketServer = (PORT: string) => {
    httpServer.listen(PORT, () => {
        logger.info(`WebSocket Server running on port ${PORT}`);
    });
}

const StopSocketServer = () => {
    logger.info('Shutting down WebSocket Server...');
    socketServer.close(() => {
        logger.info('WebSocket Server shut down gracefully.');
    });
}

export { socketServer, StartSocketServer, StopSocketServer} 