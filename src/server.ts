import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import GrpcServer from './app/grpc';
import { checkEnvVariables } from '@hireverse/service-common/dist/utils/envChecker';

(async () => {
    checkEnvVariables('MAIL_ID', 'MAIL_PASSWORD');
    const grpcserver = new GrpcServer();
    const port = process.env.PORT || '6001';
    grpcserver.start(port);
})();