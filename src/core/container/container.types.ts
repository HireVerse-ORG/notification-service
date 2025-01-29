
export default {
    EmailService: Symbol('EmailService'),

    // notification
    NotificationController: Symbol('NotificationController'),
    NotificationGrpcController: Symbol('NotificationGrpcController'),
    NotificationService: Symbol('NotificationService'),
    NotificationRepository: Symbol('NotificationRepository'),

    // socket
    SocketManager: Symbol('SocketManager'),
    SocketService: Symbol('SocketService'),

    // kafka
    KafkaProducer: Symbol('KafkaProducer'),
    KafkaConsumer: Symbol('KafkaConsumer'),
    EventController: Symbol('EventController'),
    EventService: Symbol('EventService'),
};
