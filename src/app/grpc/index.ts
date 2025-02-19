import * as grpc from '@grpc/grpc-js';
import registerServices from './registerServices';
import { logger } from '../../core/utils/logger';

class Server {
    public app: grpc.Server;

    constructor() {
        this.app = new grpc.Server();
        this.initialize()
    }

    async initialize() {
        registerServices(this.app)
    }

    start(PORT: string) {
        this.app.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
            if (error) {
                logger.error(`Error starting Notification gRPC server: ${error}`);
                process.exit(1);
            }
            logger.info(`Notification gRPC service running at 0.0.0.0:${port}`);
        });
    }

    close() {
        logger.info('Shutting down gRPC server...');
        this.app.tryShutdown(err => {
            if (err) {
                logger.error('Error during shutdown:', err);
            }
        });
    }
}


export default Server