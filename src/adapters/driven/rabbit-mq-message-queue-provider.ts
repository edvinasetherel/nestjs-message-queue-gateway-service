import amqplib from "amqplib";
import { MessageQueueProvider } from "#adapters/driven/message-queue-provider.js";

export class RabbitMqProvider implements MessageQueueProvider
{
    private connection?: amqplib.Connection;
    private channel?: amqplib.Channel;

    constructor(
        private readonly url: string,
        private readonly queueName: string,
    ) {}

    async publish(message: string): Promise<void>
    {
        if (!this.channel)
        {
            this.connection = await amqplib.connect(this.url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queueName, {
                durable: true,
            });
        }

        this.channel.sendToQueue(
            this.queueName,
            Buffer.from(message),
        );
    }

    async close(): Promise<void>
    {
        await this.channel?.close();
        await this.connection?.close();
    }
}
