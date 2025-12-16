import { Inject, Injectable } from "@nestjs/common";
import { IMESSAGE_QUEUE_GATEWAY } from "@/ports/driven/IMessageQueueGateway.js";
import type { IMessageQueueGateway } from "@/ports/driven/IMessageQueueGateway.js";

@Injectable()
export class MessageQueueService
{
    constructor(
        @Inject(IMESSAGE_QUEUE_GATEWAY)
        private readonly gateway: IMessageQueueGateway,
    ) {}

    async publish(messageDto: string)
    {
        await this.gateway.publish(messageDto);
    }
}
