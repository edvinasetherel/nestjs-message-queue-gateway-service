import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { MessageQueueService } from "@/app/services/message-queue.service.js";

@Controller()
export class AppController
{
    constructor(private readonly messagingQueueService: MessageQueueService) {}

    @Post("/message")
    @HttpCode(HttpStatus.ACCEPTED)
    async postMessage(
        @Body()
        messageDto: string,
    )
    {
        await this.messagingQueueService.publish(messageDto);
    }
}
