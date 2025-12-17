import { Inject, Injectable } from "@nestjs/common";
import type { MessageQueueGateway } from "#app/ports/driven/message-queue-gateway.js";
import { MESSAGE_QUEUE_GATEWAY } from "#app/ports/driven/message-queue-gateway.js";

@Injectable()
export class MessageQueueService
{
    constructor(
        @Inject(MESSAGE_QUEUE_GATEWAY)
        private readonly gateway: MessageQueueGateway,
    ) {}

    async publish(message: string)
    {
        await this.gateway.publish(message);
    }
}
