import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import GrpcServer from './app/grpc';
import ExpressServer from './app/express';
import { checkEnvVariables } from '@hireverse/service-common/dist/utils/envChecker';
import Database from './core/database';
import { StartSocketServer, StopSocketServer } from './app/socket';
import { startEventService, stopEventService } from './app/events';

(async () => {
    checkEnvVariables('MAIL_ID', 'MAIL_PASSWORD', 'DATABASE_URL', 'KAFKA_SERVER');

    const databaseUrl = process.env.DATABASE_URL!;
    const expressPort = process.env.EXPRESS_PORT || '5002';
    const grpcPort = process.env.GRPC_PORT || '6002';
    const socketPort = process.env.SOCKET_PORT || '7002';

    const db = new Database(databaseUrl);
    const expressServer = new ExpressServer();
    const grpcServer = new GrpcServer();
   
    db.connect(); 
    expressServer.start(expressPort);
    grpcServer.start(grpcPort);
    StartSocketServer(socketPort);
    startEventService()

    process.on('SIGINT', async () => {
        expressServer.stop();
        grpcServer.close();
        db.disconnect();
        StopSocketServer();
        stopEventService();
    });
    process.on("SIGTERM", () => {
        expressServer.stop();
        grpcServer.close();
        db.disconnect();
        StopSocketServer();
        stopEventService();
    });
})();