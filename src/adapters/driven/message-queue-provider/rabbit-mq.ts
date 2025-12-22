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

    async subscribe(handler: (message: string) => Promise<void>): Promise<void>
    {
        if (this.isClosed)
        {
            throw new ProviderError(`The provider ${this} is closed. Cannot subscribe`);
        }

        console.log(`Subscribing to RabbitMQ queue: ${this.queueName}`);

        await this.__channel!.consume(
            this.queueName,
            async (msg) =>
            {
                if (msg === null)
                {
                    return;
                }
                try
                {
                    const content = msg.content.toString();
                    console.log(`Received message from RabbitMQ:${this.queueName}: ${content}`);
                    await handler(content);
                    this.__channel!.ack(msg);
                }
                catch (error)
                {
                    console.error("Error processing message:", error);
                    this.__channel!.nack(msg, false, false);
                }
            },
            { noAck: false },
        );
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
