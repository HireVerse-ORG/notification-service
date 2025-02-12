import TYPES from "../../core/container/container.types";
import { EventController } from "../../module/event/event.controller";
import { logger } from "../../core/utils/logger";
import container from "../../core/container";
import { KafkaConsumer } from "@hireverse/kafka-communication/dist/kafka";

const eventController = container.get<EventController>(TYPES.EventController);
const eventConsumer = container.get<KafkaConsumer>(TYPES.KafkaConsumer);

export async function startEventService() {
    try {
        await eventConsumer.connect();
        await eventController.initializeSubscriptions();
        logger.info("Event service started successfully.");
    } catch (error) {
        logger.error("Error starting the event service:", error);
    }
}

export async function stopEventService() {
    try {
        await eventConsumer.disconnect();
        logger.info("Event service stopped successfully.");
    } catch (error) {
        logger.error("Error stopping the event service:", error);
    }
}
