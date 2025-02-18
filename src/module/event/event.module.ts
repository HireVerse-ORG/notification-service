import { Container } from "inversify";
import { kafka } from "@hireverse/kafka-communication";
import { EventController } from "./event.controller";
import TYPES from "../../core/container/container.types";
import { KafkaConnect, KafkaConsumer } from "@hireverse/kafka-communication/dist/kafka";

const kafkaConnect = new KafkaConnect({
    clientId: "notification-service",
    brokers: [process.env.KAFKA_SERVER!],
    retry: {
        retries: 5, 
        factor: 0.2,
    }
})

export const kafkaConsumer = new kafka.KafkaConsumer(kafkaConnect, { 
        groupId: "notification-group", 
        allowAutoTopicCreation: process.env.NODE_ENV === "development"
    });

export function loadEventContainer(container: Container) {
    container.bind<KafkaConsumer>(TYPES.KafkaConsumer).toConstantValue(kafkaConsumer);
    container.bind<EventController>(TYPES.EventController).to(EventController);
}
