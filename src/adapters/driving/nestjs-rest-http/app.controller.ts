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
import {
    PublisherService,
} from "#app/services/publisher.service.js";
import Message from "#app/domain/message.js";
import type MessageDto from "#adapters/driving/nestjs-rest-http/messsage.dto.js";
import UnrecognizedQueueError from "#app/unrecognized-queue-error.js";
import {
    SubscriberService,
} from "#app/services/subscriber.service.js";
import type SubscribeDto from "#adapters/driving/nestjs-rest-http/subscribe.dto.js";
import Subscription from "#app/domain/subscription.js";
import AlreadySubscribedError from "#app/services/already-subscribed-error.js";

export const POST_MESSAGE_ENDPOINT_PATH = "/messages";
export const POST_SUBSCRIBE_ENDPOINT_PATH = "/subscribe";

const logger = new Logger("AppController");

@Controller()
export class AppController
{
    constructor(
        private readonly messagingQueueService: PublisherService,
        private readonly subscriberService: SubscriberService,
    )
    {}

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
        catch (err)
        {
            logger.error(err);
            throw new BadRequestException("The message request is malformed");
        }

        try
        {
            await this.messagingQueueService.publish(
                message.content,
                message.queueName,
            );
        }
        catch (err)
        {
            logger.error(err);
            if (err instanceof UnrecognizedQueueError)
            {
                throw new NotFoundException(err.message);
            }

            throw new InternalServerErrorException(err);
        }
    }

    @Post(POST_SUBSCRIBE_ENDPOINT_PATH)
    @HttpCode(HttpStatus.ACCEPTED)
    async postSubscribe(
        @Body()
        subscribeDto: SubscribeDto,
    )
    {
        let subscription: Subscription;
        try
        {
            subscription = new Subscription(subscribeDto);
        }
        catch (err)
        {
            logger.error(err);
            throw new BadRequestException("The subscription request is malformed");
        }
        try
        {
            console.log(`Subscribing to queue: ${subscription.queueName}`);
            await this.subscriberService.subscribe(
                subscription.queueName,
                async (message) =>
                {
                    logger.log(`[${subscribeDto.queueName}] Received message: ${message}`);
                },
            );
        }
        catch (e)
        {
            logger.error(e);
            if (e instanceof UnrecognizedQueueError)
            {
                throw new NotFoundException(e.message);
            }
            if (e instanceof AlreadySubscribedError)
            {
                throw new BadRequestException(e.message);
            }
            throw new InternalServerErrorException(e);
        }
    }
}
