
import { loadProto } from '@hireverse/service-protos';
import container from '../../core/container';
import TYPES from '../../core/container/container.types';
import { NotificationGrpcController } from '../../module/notification/controllers/notification.grpc.controller';

const proto = loadProto('notification/notification.proto');

const notificationController = container.get<NotificationGrpcController>(TYPES.NotificationGrpcController)

export const notificationService = {
    name: "Notification Service",
    serviceDefinition: proto.notification.NotificationService.service,
    implementation: notificationController.getProcedures(),
}
