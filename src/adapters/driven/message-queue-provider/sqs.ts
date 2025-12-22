import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { MessageQueueProvider } from "#app/ports/driven/message-queue-provider.js";
import ProviderError from "#adapters/driven/message-queue-provider/error.js";

export class SqsProvider
implements MessageQueueProvider
{
    private __client: SQSClient | null;
    private readonly __queueUrl: string;

    constructor(
        client: SQSClient,
        queueUrl: string,
    )
    {
        this.__queueUrl = queueUrl;
        this.__client = client;
    }

    get isClosed()
    {
        return this.__client === null;
    }

    async publish(message: string): Promise<void>
    {
        if (this.isClosed)
        {
            throw new ProviderError(`The provider ${this} is closed. Cannot publish the message`);
        }

        console.log(`Publishing message ${message} to queue ${this.__queueUrl}`);

        const command = new SendMessageCommand({
            QueueUrl: this.__queueUrl,
            MessageBody: message,
        });

        await this.__client!.send(command);
    }

    async close(): Promise<void>
    {
        this.__client?.destroy();
        this.__client = null;
    }

    toString()
    {
        return `SqsProvider(IsClosed=${this.isClosed}, QueueUrl=${this.__queueUrl})`;
    }
}
