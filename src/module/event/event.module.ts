import { Container } from "inversify";
import { kafka } from "@hireverse/kafka-communication";
import { EventController } from "./event.controller";
import TYPES from "../../core/container/container.types";
import { KafkaConnect, KafkaConsumer } from "@hireverse/kafka-communication/dist/kafka";
import { logger } from "../../core/utils/logger";

const kafkaConnect = new KafkaConnect({
    clientId: "notification-service",
    brokers: [process.env.KAFKA_SERVER!],
    retry: {
        retries: 10,              
        initialRetryTime: 500,   
        factor: 0.3,              
        multiplier: 2,           
        maxRetryTime: 60_000,    
        restartOnFailure: async (error) => {
            logger.error("Kafka connection failed:", error);
            return true; 
        },
    }
})

export const kafkaConsumer = new kafka.KafkaConsumer(kafkaConnect, { 
        groupId: "notification-group", 
        allowAutoTopicCreation: true,
    });

export function loadEventContainer(container: Container) {
    container.bind<KafkaConsumer>(TYPES.KafkaConsumer).toConstantValue(kafkaConsumer);
    container.bind<EventController>(TYPES.EventController).to(EventController);
}
