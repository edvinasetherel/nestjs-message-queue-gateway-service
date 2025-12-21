import amqp from "amqplib";
import { MessageQueueProvider } from "#app/ports/driven/message-queue-provider.js";
import ProviderError from "#adapters/driven/message-queue-provider/error.js";

export class RabbitMqProvider
implements MessageQueueProvider
{
    private __channel: amqp.Channel | null;
    readonly queueName: string;

    constructor(
        channel: amqp.Channel,
        queueName: string,
    )
    {
        this.queueName = queueName;
        this.__channel = channel;
    }

    get isClosed()
    {
        return this.__channel === null;
    }

    async publish(message: string): Promise<void>
    {
        if (this.isClosed)
        {
            throw new ProviderError(`The provider ${this} is closed. Cannot publish the message`);
        }
        console.log(`Publishing message ${message} to queue ${this.queueName}`);
        const canAcceptMore = this.__channel!.sendToQueue(
            this.queueName,
            Buffer.from(message),
            { persistent: true },
        );

        if (!canAcceptMore)
        {
            await new Promise<void>((resolve) =>
            {
                this.__channel!.once("drain", resolve);
            });
        }
    }

    async close(): Promise<void>
    {
        this.__channel = null;
    }

    toString()
    {
        return `RabbitMqProvider(IsClosed=${this.isClosed}, Queue=${this.queueName})`;
    }
}
