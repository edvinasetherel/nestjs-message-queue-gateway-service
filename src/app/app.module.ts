import { Module } from "@nestjs/common";
import { AppController } from "#adapters/driving/app.controller.js";
import { MessageQueueService } from "#app/services/message-queue.service.js";
import { MESSAGE_QUEUE_GATEWAY } from "#app/ports/driven/message-queue-gateway.js";
import { CompositeMessageQueueGateway } from "#adapters/driven/composite-message-queue-gateway.js";
import InMemoryMessageQueueProvider from "#adapters/driven/in-memory-message-queue-provider.js";

@Module({
    imports: [],
    controllers: [AppController],
    providers: [
        MessageQueueService,
        {
            provide: MESSAGE_QUEUE_GATEWAY,
            useValue: new CompositeMessageQueueGateway([
                new InMemoryMessageQueueProvider(),
            ]),
        },
    ],
})
export class AppModule {}
