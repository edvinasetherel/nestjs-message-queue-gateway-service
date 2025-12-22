import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Logger, NotFoundException,
    Post,
} from "@nestjs/common";
import { MessagePublisherService } from "#app/services/message-publisher.service.js";
import Message from "#app/domain/message.js";
import type MessageDto from "#adapters/driving/nestjs-rest-http/messsage.dto.js";
import UnrecognizedQueueError from "#app/unrecognized-queue-error.js";

export const POST_MESSAGE_ENDPOINT_PATH = "/messages";

const logger = new Logger("AppController");

@Controller()
export class AppController
{
    constructor(private readonly messagingQueueService: MessagePublisherService) {}

    @Post(POST_MESSAGE_ENDPOINT_PATH)
    @HttpCode(HttpStatus.ACCEPTED)
    async postMessage(
        @Body()
        messageDto: MessageDto,
    )
    {
        let message: Message;
        try
        {
            message = new Message(messageDto);
        }
        catch (e)
        {
            logger.error(e);
            throw new BadRequestException("The message is malformed");
        }

        try
        {
            await this.messagingQueueService.publish(message.content, message.queueName);
        }
        catch (e)
        {
            logger.error(e);
            if (e instanceof UnrecognizedQueueError)
            {
                throw new NotFoundException(e.message);
            }

            throw new InternalServerErrorException(e);
        }
    }
}
