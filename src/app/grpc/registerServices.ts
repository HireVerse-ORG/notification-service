import * as grpc from '@grpc/grpc-js';
import { logger } from '../../core/utils/logger';
import { notificationService } from './services';

const registerServices = (server: grpc.Server) => {
    const services = [notificationService]

    services.forEach(({ name, serviceDefinition, implementation }) => {
        server.addService(serviceDefinition, implementation);
        logger.info(`Service registered: ${name}`);
    });
};

export default registerServices